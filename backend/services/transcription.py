import os
import openai
import tempfile

# Add logging for API key
api_key = os.getenv('OPENAI_API_KEY')
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
print(f"API Key length: {len(api_key) if api_key else 0}")

openai.api_key = api_key

def transcribe_audio(audio_file):
    """Transcribe audio using OpenAI Whisper API"""
    try:
        with open(audio_file, "rb") as file:
            transcription = openai.Audio.transcribe(
                model="whisper-1",
                file=file,
                language="en"
            )
        return transcription.text
    except Exception as e:
        print(f"Error in transcription: {str(e)}")
        return None

def format_ehr(transcription):
    """Format transcription into structured EHR using GPT-4"""
    try:
        prompt = f"""Please format this medical transcription into a structured EHR with the following sections:
        - Chief Complaint
        - History of Present Illness
        - Past Medical History
        - Medications
        - Assessment
        - Plan
        
        Transcription: {transcription}"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a medical transcriptionist assistant. Format the given transcription into a structured EHR format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in EHR formatting: {str(e)}")
        return None

def process_audio(audio_data):
    """Process audio data into structured EHR"""
    try:
        # Save audio data to temporary file
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as temp_audio:
            temp_audio.write(audio_data)
            temp_audio_path = temp_audio.name

        # Transcribe audio directly using OpenAI API
        transcription = transcribe_audio(temp_audio_path)
        if not transcription:
            return {"error": "Transcription failed"}

        # Format into EHR
        formatted_ehr = format_ehr(transcription)
        if not formatted_ehr:
            return {"error": "EHR formatting failed"}

        # Cleanup temporary file
        os.unlink(temp_audio_path)

        return {
            "transcription": transcription,
            "formatted_ehr": formatted_ehr
        }
    except Exception as e:
        print(f"Error in process_audio: {str(e)}")
        return {"error": str(e)} 