import axios from 'axios';

export async function POST(request: Request) {
    const fileJSON = await request.json()
    const processingUrl = "https://api.cleanvoice.ai/v2/edits"
    try {
        const body = {
            input: {
                "files": [fileJSON["fileUrl"]],
                "config": {
                    "long_silences": true,
                    "hesitations": true,
                    "mouth_sounds": true,
                    "fillers": true,
                    "remove_noise": true,
                    "normalize": true,
                    "stutters": true,
                    "breath": true,
                    "transcription": true,
                    "summarize": true
                }
            }
        };
        const headers = {
            "X-API-Key": process.env.CLEANVOICE_API_KEY,
            "Content-Type": "application/json"
        };
    
        return Response.json(
            await axios.post(processingUrl, body, { headers })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error
            })
        )
    } catch (error) {
        return Response.json({ error });
    }
}