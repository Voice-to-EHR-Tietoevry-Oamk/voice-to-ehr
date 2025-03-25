import os
import openai
import tempfile
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Debug logging
logger.info("Azure OpenAI Configuration:")
logger.info(f"Whisper API Key present: {'Yes' if os.getenv('AZURE_OPENAI_KEY_WHISPER') else 'No'}")
logger.info(f"Whisper Endpoint present: {'Yes' if os.getenv('AZURE_OPENAI_ENDPOINT_WHISPER') else 'No'}")
logger.info(f"Turbo API Key present: {'Yes' if os.getenv('AZURE_OPENAI_KEY_TURBO') else 'No'}")
logger.info(f"Turbo Endpoint present: {'Yes' if os.getenv('AZURE_OPENAI_ENDPOINT_TURBO') else 'No'}")

def configure_whisper():
    """Configure OpenAI for Whisper"""
    openai.api_type = "azure"
    openai.api_key = os.getenv('AZURE_OPENAI_KEY_WHISPER')
    openai.api_base = os.getenv('AZURE_OPENAI_ENDPOINT_WHISPER')
    openai.api_version = "2024-02-15-preview"

def configure_turbo():
    """Configure OpenAI for GPT-3.5 Turbo"""
    openai.api_type = "azure"
    openai.api_key = os.getenv('AZURE_OPENAI_KEY_TURBO')
    openai.api_base = os.getenv('AZURE_OPENAI_ENDPOINT_TURBO')
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
            
        logger.info(f"Transcription successful: {transcription.text[:100]}...")
        return transcription.text

    except FileNotFoundError as e:
        logger.error(f"File error: {str(e)}")
        return None
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return None
    except openai.error.AuthenticationError as e:
        logger.error(f"Authentication failed: {str(e)}")
        return None
    except openai.error.RateLimitError as e:
        logger.error(f"Rate limit exceeded: {str(e)}")
        return None
    except openai.error.APIConnectionError as e:
        logger.error(f"API Connection error: {str(e)}")
        return None
    except openai.error.APIError as e:
        logger.error(f"API error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in transcription: {str(e)}")
        return None

def format_ehr(transcription, max_retries=3):
    """Format transcription into structured EHR using Azure OpenAI with retry logic"""
    for attempt in range(max_retries):
        try:
            # Configure for Turbo
            configure_turbo()

            if not transcription:
                raise ValueError("Transcription input is empty")

            prompt = f"""Please format this medical transcription into a structured EHR with the following sections:
            - Chief Complaint
            - History of Present Illness
            - Past Medical History
            - Medications
            - Assessment
            - Plan
            
            Transcription: {transcription}"""

            response = openai.ChatCompletion.create(
                engine="gpt-35-turbo",
                messages=[
                    {"role": "system", "content": "You are a medical transcriptionist assistant. Format the given transcription into a structured EHR format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=4096
            )
            
            if not response or not response.choices:
                raise ValueError("No response generated from the model")
                
            formatted_text = response.choices[0].message['content']
            if not formatted_text:
                raise ValueError("Empty response from the model")
                
            logger.info("EHR formatting successful")
            return formatted_text

        except openai.error.RateLimitError as e:
            if attempt < max_retries - 1:
                wait_time = 65  # Wait 65 seconds before retry
                logger.warning(f"Rate limit hit, waiting {wait_time} seconds before retry {attempt + 1}/{max_retries}")
                time.sleep(wait_time)
                continue
            logger.error(f"Rate limit exceeded after {max_retries} retries")
            return None
        except Exception as e:
            logger.error(f"Error in EHR formatting: {str(e)}")
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
            logger.info(f"Temporary file created: {temp_audio_path}")

        try:
            # Transcribe audio
            transcription = transcribe_audio(temp_audio_path)
            if not transcription:
                raise ValueError("Transcription failed")

            # Return transcription immediately
            result = {
                "transcription": transcription,
                "status": "transcribed"
            }

            # Try to format EHR
            formatted_ehr = format_ehr(transcription)
            if formatted_ehr:
                result["formatted_ehr"] = formatted_ehr
                result["status"] = "completed"
            else:
                result["error"] = "EHR formatting failed (rate limit - please try formatting again in 60 seconds)"

            return result

        finally:
            # Cleanup temporary file
            try:
                os.unlink(temp_audio_path)
                logger.info("Temporary file cleaned up")
            except Exception as e:
                logger.warning(f"Failed to cleanup temporary file: {str(e)}")

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return {"error": str(e)}
    except Exception as e:
        logger.error(f"Error in process_audio: {str(e)}")
        return {"error": str(e)} 