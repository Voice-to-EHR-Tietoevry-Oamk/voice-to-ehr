import os
import openai
import tempfile
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def configure_whisper():
    """Configure OpenAI for Whisper"""
    openai.api_type = "azure"
    openai.api_key = os.getenv('AZURE_OPENAI_KEY_WHISPER')
    openai.api_base = os.getenv('AZURE_OPENAI_ENDPOINT_WHISPER')
    openai.api_version = "2024-02-15-preview"

def configure_gpt4():
    """Configure OpenAI for GPT-4"""
    openai.api_type = "azure"
    openai.api_key = os.getenv('AZURE_OPENAI_KEY')
    openai.api_base = os.getenv('AZURE_OPENAI_ENDPOINT')
    openai.api_version = "2024-02-15-preview"

def transcribe_audio(audio_file):
    """Transcribe audio using Azure OpenAI Whisper API"""
    try:
        # Configure for Whisper
        configure_whisper()
        
        logger.info(f"Attempting to transcribe file: {audio_file}")
        
        # Validate file exists and is readable
        if not os.path.exists(audio_file):
            raise FileNotFoundError(f"Audio file not found: {audio_file}")
        
        file_size = os.path.getsize(audio_file)
        logger.info(f"File size: {file_size} bytes")
        
        if file_size == 0:
            raise ValueError("Audio file is empty")
        
        # Check file format
        if not audio_file.lower().endswith(('.wav', '.mp3', '.m4a', '.webm')):
            raise ValueError("Unsupported audio format. Please use WAV, MP3, M4A, or WEBM")

        with open(audio_file, "rb") as file:
            transcription = openai.Audio.transcribe(
                model="whisper",
                deployment_id="whisper",
                file=file,
                language="en"
            )
        
        if not transcription or not transcription.text:
            raise ValueError("Transcription returned empty result")
            
        print("\n================== AUDIO TO TEXT ==================")
        print(transcription.text)
        print("==================================================\n")
        
        return transcription.text

    except Exception as e:
        print("\n================== TRANSCRIPTION ERROR ==================")
        print(f"Error: {str(e)}")
        print("======================================================\n")
        return None

def format_ehr(transcription):
    """Format transcription into minimal, clear EHR note"""
    try:
        configure_gpt4()
        if not transcription:
            raise ValueError("Empty transcription")

        prompt = '''Convert this medical transcription into a clear, concise note with these sections:

        SYMPTOMS:
        [Main symptoms with duration and severity]

        DIAGNOSIS:
        [Primary diagnosis only]

        TREATMENT:
        [Key medications and instructions]

        Rules:
        1. Maximum 3 lines per section
        2. Use simple, clear medical terms
        3. Focus on essential information only
        4. No bullet points or lists
        5. Write "None recorded" if no information
        6. Keep medical terms as spoken by doctor
        7. No detailed explanations or differentials
        8. One clear action item per section

        Example format:
        SYMPTOMS:
        Severe headache for 3 days, right temple, 8/10 pain with nausea.

        DIAGNOSIS:
        Acute migraine, first episode.

        TREATMENT:
        Sumatriptan 50mg PRN, rest in dark room, follow up in 1 week.

        Text: {text}'''.format(text=transcription)

        response = openai.ChatCompletion.create(
            deployment_id="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are creating minimal, clear medical notes. Be concise but precise."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=300
        )
        
        formatted_text = response.choices[0].message['content']
        
        print("\n================== TEXT TO EHR ==================")
        print(formatted_text)
        print("=============================================\n")
        
        # Parse sections
        sections = {
            'symptoms': '',
            'diagnosis': '',
            'treatment': ''
        }
        
        current_section = None
        for line in formatted_text.split('\n'):
            if 'SYMPTOMS:' in line:
                current_section = 'symptoms'
            elif 'DIAGNOSIS:' in line:
                current_section = 'diagnosis'
            elif 'TREATMENT:' in line:
                current_section = 'treatment'
            elif line.strip() and current_section:
                sections[current_section] += line.strip() + ' '
        
        # Clean up sections
        for key in sections:
            sections[key] = sections[key].strip()
            if not sections[key]:
                sections[key] = "None recorded"
        
        return sections

    except Exception as e:
        print("\n================== ERROR ==================")
        print(f"Error: {str(e)}")
        print("=========================================\n")
        return None

def process_audio(audio_data):
    """Process audio data into structured EHR"""
    try:
        if not audio_data:
            raise ValueError("No audio data provided")

        # Save audio data to temporary file
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as temp_audio:
            temp_audio.write(audio_data)
            temp_audio_path = temp_audio.name

        try:
            # Transcribe audio
            transcription = transcribe_audio(temp_audio_path)
            if not transcription:
                return {"error": "Transcription failed"}

            # Format EHR
            formatted_data = format_ehr(transcription)
            if not formatted_data:
                return {"error": "EHR formatting failed"}

            result = {
                "success": True,
                "transcription": transcription,
                "symptoms": formatted_data['symptoms'],
                "diagnosis": formatted_data['diagnosis'],
                "treatment": formatted_data['treatment'],
                "timestamp": None  # Will be set by API
            }

            return result

        finally:
            try:
                os.unlink(temp_audio_path)
            except:
                pass

    except Exception as e:
        return {"error": str(e)} 