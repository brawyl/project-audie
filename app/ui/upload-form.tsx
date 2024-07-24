'use client'

import { useState, useRef } from 'react'
import Loader from '../components/loader'
import allowedDomains from '../components/validate'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function UploadForm() {
  const [email, setEmail] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (email) {
      let domain = email.split("@")[1]
      if (!allowedDomains.includes(domain)) {
        alert('Your email is not authorized.')
        return
      }
    }

    if (!file) {
      alert('Please select a file to upload.')
      return
    }

    setIsLoading(true)

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      }
    )

    if (response.ok) {
      const { url, fields, key } = await response.json()

      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append('file', file)

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {        
        let objectUrl = url + key

        const processResponse = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + '/api/process',
          {
            method: 'POST',
            body: JSON.stringify({ fileUrl: objectUrl }),
          }
        )
    
        if (processResponse.ok) {
          const responseJSON = await processResponse.json()
          const processedUrl = "https://app.cleanvoice.ai/file_beta?upload_id=" + responseJSON["id"]

          const emailResponse = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + '/api/send',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipient: email, fileUrl: processedUrl }),
            }
          )
      
          if (emailResponse.ok) {
            alert('File uploaded and email sent successfully!')
            console.log(emailResponse)
          } else {
            console.error('Email Error:', emailResponse)
            alert('Your file uploaded but the email send failed.')
          }

        } else {
          console.error('Processing Error:', processResponse)
          alert('Your file uploaded but the processing request failed.')
        }

      } else {
        console.error('S3 Upload Error:', uploadResponse)
        alert('Upload failed. No email sent.')
      }
    } else {
      alert('Failed to get pre-signed URL. Check your S3 configuration.')
    }

    setIsLoading(false)
  }

  return (
    <div>
      {isLoading && <Loader/>}
      <form onSubmit={handleSubmit}>

      <div className="relative">

        <div className='centered formBox'>
          <h3>1. Enter an email address to receive the processed files:</h3>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={(e) => {
              const emailAddress = e.target.value
              if (emailAddress) {
                setEmail(emailAddress)
              }
            }}
            required
          />
        </div>

        <div className='centered formBox'>
          <h3>2. Upload your podcast audio file here:</h3>
          <button 
            className="button-upload"
            type="button"
            onClick={handleClick}>
            <FontAwesomeIcon icon={faFileArrowUp} className="fas" size="3x"></FontAwesomeIcon>
          </button>
          <br />
          <input
            id="file"
            type="file"
            onChange={(e) => {
              const files = e.target.files
              if (files) {
                setFile(files[0])
                document.getElementById("fileLabel").innerHTML = files[0].name
              }
            }}
            accept="audio/*"
            ref={hiddenFileInput}
            style={{display: 'none'}} // Make the file input element invisible
          />
          <label id="fileLabel" htmlFor="file"></label>
          <br/><br/>
          <button id='uploadButton' type="submit" disabled={isLoading}>
            Upload
          </button>
        </div>

        </div>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
      </div>
      </form>
    </div>
  )
}
