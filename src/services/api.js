/**
 * Enterprise Client-side API Service with Real-time Streaming & Offline Resilience Fallback
 */

import { evaluateSafetyRules } from '../../lib/safetyRules/index.js';
import { generateDeterministicResponse, formatResponsePayload } from '../../lib/analysis/index.js';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Request risk assessment with live progress feedback
 * @param {string} text 
 * @param {string[]} chips 
 * @param {(phase: string) => void} [onProgress]
 * @returns {Promise<Object>}
 */
export async function requestRiskAssessment(text, chips, onProgress) {
  // If streaming progress callback is provided, try SSE streaming endpoint
  if (typeof onProgress === 'function') {
    try {
      const streamRes = await fetch(`${API_BASE}/api/analyze/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, chips }),
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalResult = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const chunk of lines) {
            const eventMatch = chunk.match(/event:\s*([^\n]+)/);
            const dataMatch = chunk.match(/data:\s*([^\n]+)/);

            if (eventMatch && dataMatch) {
              const eventType = eventMatch[1].trim();
              const eventData = JSON.parse(dataMatch[1].trim());

              if (eventType === 'phase' && eventData.message) {
                onProgress(eventData.message);
              } else if (eventType === 'result') {
                finalResult = eventData;
              }
            }
          }
        }

        if (finalResult) {
          return formatResponsePayload(finalResult);
        }
      }
    } catch (streamErr) {
      console.warn('Streaming fetch failed, falling back to standard endpoint:', streamErr.message);
    }
  }

  // Standard JSON Endpoint Fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, chips }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server xatosi: ${response.status}`);
    }

    const data = await response.json();
    return formatResponsePayload(data);
  } catch (err) {
    console.warn('Backend proxy unavailable, activating offline deterministic fallback:', err.message);
    
    // Offline execution: evaluate locally in browser RAM
    const rules = evaluateSafetyRules(text, chips);
    return generateDeterministicResponse(text, chips, rules);
  }
}
