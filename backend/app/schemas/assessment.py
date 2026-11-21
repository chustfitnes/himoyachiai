"""Pydantic V2 Schemas for HimoyaAI API contracts."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class AssessmentRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Foydalanuvchi murojaati matni (maksimal 4000 belgi)"
    )
    lang: Optional[str] = Field(
        default="uz-lat",
        description="Til: 'uz-lat' | 'uz-cyr' | 'ru'"
    )
    is_minor: Optional[bool] = Field(
        default=False,
        description="Foydalanuvchi bola yoki o‘smir ekanligi belgisi"
    )

class AssessmentResponse(BaseModel):
    risk_level: str = Field(
        ...,
        description="'green' | 'yellow' | 'red'"
    )
    confidence_pct: int = Field(
        ...,
        ge=0,
        le=100,
        description="Kalibrlangan ishonch foizi (0-100)"
    )
    low_confidence: bool = Field(
        default=False,
        description="Ishonch darajasi 60% dan past bo‘lsa yoki konservativ eskalatsiya qilingan bo‘lsa true"
    )
    signals: List[str] = Field(
        default_factory=list,
        description="Aniqlangan xavf toifalari nomlari (matnning o‘zi saqlanmaydi va qaytarilmaydi)"
    )
    playbook: Dict[str, Any] = Field(
        default_factory=dict,
        description="Xavf darajasiga mos amaliy yordam yo‘riqnomasi va qadamlar"
    )
    disclaimer: str = Field(
        ...,
        description="Tizim yakuniy tashxis emasligi va xolis yo‘naltiruvchi ekanligi haqidagi rasmiy eslatma"
    )
    model_version: str = Field(
        default="v1.0-hybrid",
        description="Gibrid tahlil model versiyasi"
    )

class CenterItem(BaseModel):
    district: str
    name: str
    address: str
    phone: str
    services: List[str]
    verified: bool

class RegionCentersResponse(BaseModel):
    region_id: str
    region_name: str
    centers: List[CenterItem]
