# ATC Master Platform - AI Email Generation API
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/ai", tags=["ai"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


class EmailGenerateRequest(BaseModel):
    lead_name: str
    organization: str
    role: str
    service_type: Optional[str] = None


class EmailResponse(BaseModel):
    subject: str
    body: str


@router.post("/generate-email", response_model=EmailResponse)
async def generate_outreach_email(request: EmailGenerateRequest):
    """Generate a personalized outreach email using AI"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Initialize the chat
        chat = LlmChat(
            api_key=api_key,
            session_id=f"email-gen-{request.lead_name.replace(' ', '-')}",
            system_message="""You are a professional business development assistant for Achieve Together Care (ATC), 
an NDIS registered provider in NSW, Australia. You write warm, professional outreach emails to Support Coordinators, 
Plan Managers, and Recovery Coaches to introduce ATC's disability support services.

ATC provides:
- Community Access & Social Participation
- Daily Living Support
- Capacity Building
- Transport Assistance
- Respite Care

The tone should be:
- Professional but warm
- Person-centered
- Focused on collaboration
- Compliant with NDIS standards

Always sign off as:
Daniel Hayward
Business Owner
Achieve Together Care
M: 0422 492 736
E: daniel@achievetogethercare.com.au
W: achievetogethercare.com.au"""
        ).with_model("openai", "gpt-4o")
        
        # Build the prompt based on role
        role_context = {
            "Support Coordinator": "focuses on helping participants achieve their NDIS goals through coordinated supports",
            "Plan Manager": "manages NDIS funding and invoicing for participants",
            "Recovery Coach": "supports participants with psychosocial disabilities on their recovery journey",
            "Team Coordinator": "coordinates support teams and service delivery"
        }
        
        role_info = role_context.get(request.role, "works in the disability support sector")
        
        prompt = f"""Generate a professional outreach email for:

Name: {request.lead_name}
Organization: {request.organization}
Role: {request.role} (who {role_info})
{f"Service Interest: {request.service_type}" if request.service_type else ""}

The email should:
1. Introduce Achieve Together Care briefly
2. Acknowledge their role and the value they provide
3. Express interest in collaborating to support mutual participants
4. Mention we serve the Shoalhaven, Illawarra, and South Coast regions
5. Offer to send our capability statement or arrange a brief call
6. Be concise (under 200 words for the body)

Format your response as:
SUBJECT: [email subject line]

BODY:
[email body text]"""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse the response
        lines = response.strip().split('\n')
        subject = ""
        body_lines = []
        in_body = False
        
        for line in lines:
            if line.startswith("SUBJECT:"):
                subject = line.replace("SUBJECT:", "").strip()
            elif line.startswith("BODY:"):
                in_body = True
            elif in_body:
                body_lines.append(line)
        
        body = '\n'.join(body_lines).strip()
        
        if not subject:
            subject = f"Introducing Achieve Together Care - Partnership Opportunity"
        if not body:
            body = response
        
        return EmailResponse(subject=subject, body=body)
        
    except ImportError:
        raise HTTPException(status_code=500, detail="AI integration not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating email: {str(e)}")


@router.post("/generate-report-summary")
async def generate_report_summary(shift_data: dict):
    """Generate an AI summary for a shift report"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"report-{shift_data.get('shift_id', 'new')}",
            system_message="""You are a clinical documentation assistant for Achieve Together Care (ATC), 
an NDIS registered provider. You help support workers write professional, person-centered shift reports
that align with NDIS documentation standards. Focus on:
- Objective observations
- Goal progress
- Participant engagement
- Support provided
Keep summaries concise and professional."""
        ).with_model("openai", "gpt-4o")
        
        prompt = f"""Generate a professional shift report summary based on:

Participant: {shift_data.get('participant', 'Unknown')}
Date: {shift_data.get('date', 'Today')}
Duration: {shift_data.get('hours', 0)} hours
Activities: {', '.join(shift_data.get('activities', []))}
Engagement Level: {shift_data.get('engagement', 'Good')}
Goals Worked On: {', '.join(shift_data.get('goals', []))}
Notes: {shift_data.get('notes', 'N/A')}

Write a 2-3 sentence professional summary suitable for NDIS documentation."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {"summary": response.strip()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")
