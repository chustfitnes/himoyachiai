/**
 * Client-side API Service with Offline Resilience Fallback
 */

import { evaluateSafetyRules } from '../../lib/safetyRules/index.js';
import { generateDeterministicResponse } from '../../lib/analysis/index.js';

export async function requestRiskAssessment(text, chips) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('/api/analyze', {
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
    return data;
  } catch (err) {
    console.warn('Backend proxy unavailable, activating offline deterministic fallback:', err.message);
    
    // Offline / fallback execution: evaluate locally so user is never left without guidance
    const rules = evaluateSafetyRules(text, chips);
    return generateDeterministicResponse(text, chips, rules);
  }
}
