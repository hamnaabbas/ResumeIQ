'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import axios from 'axios'

interface UploadedFile {
  name: string
  size: number
  type: string
  uploadedAt: string
}

export default function UploadResume() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF or Word document.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.'
    }
    return null
  }

  const handleFileSelect = async (file: File) => {
    setError(null)
    setSuccess(false)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // TODO: Replace with actual API endpoint
      const response = await axios.post('/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleString(),
      })

      setSuccess(true)
      
      // Reset form after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to upload resume. Please try again.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h1>
          <p className="text-gray-600">
            Upload your resume to get started with AI-powered analysis, job matching, and optimization.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              className="hidden"
              disabled={isLoading}
            />

            {isLoading ? (
              <div className="space-y-3">
                <Loader className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Uploading your resume...</p>
              </div>
            ) : (
              <div
                className="space-y-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Drag and drop your resume here
                  </p>
                  <p className="text-gray-600 mt-1">
                    or{' '}
                    <span className="text-blue-600 font-medium hover:text-blue-700">
                      click to browse
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Supported formats: PDF, DOC, DOCX • Maximum size: 5MB
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Upload failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && uploadedFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Resume uploaded successfully!</p>
                <p className="text-green-700 text-sm">Your resume is ready for analysis.</p>
              </div>
            </div>
          )}

          {/* File Details */}
          {uploadedFile && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Uploaded Resume</h3>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatFileSize(uploadedFile.size)} • Uploaded {uploadedFile.uploadedAt}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {uploadedFile && (
            <div className="mt-8 space-y-3 sm:flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition"
              >
                Upload Different File
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Analyze Resume
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Analysis',
              description: 'Get instant insights into your resume structure, content, and ATS compatibility.',
            },
            {
              title: 'Job Matching',
              description: 'Compare your resume against job descriptions to find the perfect alignment.',
            },
            {
              title: 'Smart Optimization',
              description: 'Receive actionable recommendations to improve your resume while keeping it authentic.',
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
