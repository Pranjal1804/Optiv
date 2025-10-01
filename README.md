# OptivSec File Analysis Tool

OptivSec is an AI-powered file analysis tool designed for security professionals. It processes various file types (PDF, DOCX, PPTX, XLSX, XLS, CSV, images) to extract text, mask sensitive information (PII), and generate security insights using machine learning models.

## Features

- **File Type Support**: Handles PDF, DOCX, PPTX, Excel (XLSX/XLS), CSV, and image files.
- **PII Masking**: Automatically detects and redacts personally identifiable information (emails, IPs, phone numbers, API keys, etc.) using NER and regex patterns.
- **Security Insights**: Extracts firewall rules, IAM policies, ports, and other security-related keywords.
- **AI Summarization**: Generates concise summaries of file content.
- **Image Analysis**: Uses vision models to describe image content.
- **Web Interface**: Next.js frontend for easy file uploads and result viewing.

## Architecture

- **Backend**: Python FastAPI application with LangChain agents, Hugging Face transformers, and Google Generative AI.
- **Frontend**: Next.js application with TypeScript for the user interface.

## Prerequisites

- Python 3.8+
- Node.js 18+
- LibreOffice (for Excel/PPT conversion)
- Tesseract OCR (for image text extraction)

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd optiv
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

5. Install system dependencies:
   - Ubuntu/Debian: `sudo apt-get install tesseract-ocr libreoffice`
   - macOS: `brew install tesseract libreoffice`

### Frontend Setup

1. Navigate to the frontend directory (assuming it's in the same repo):
   ```bash
   cd app  # Adjust if the Next.js app is in a different folder
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   BACKEND_URL=http://localhost:8000/analyze_file/
   ```

## Usage

### Running the Backend

Start the FastAPI server:
```bash
uvicorn optivsec_1_1:app --reload --host 0.0.0.0 --port 8000
```

### Running the Frontend

Start the Next.js development server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser to access the web interface.

### API Usage

Upload a file via the web interface or use curl:
```bash
curl -X POST "http://localhost:8000/analyze_file/" -F "file=@path/to/your/file.pdf"
```

## Project Structure

- `optivsec_1_1.py`: Main FastAPI application with file processing logic.
- `app/`: Next.js frontend application.
- `requirements.txt`: Python dependencies.
- `.gitignore`: Git ignore rules.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test thoroughly.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Disclaimer

This tool is for security analysis purposes. Ensure compliance with data privacy laws when processing files containing sensitive information.