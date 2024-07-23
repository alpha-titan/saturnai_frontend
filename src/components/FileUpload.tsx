import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [financialInfo, setFinancialInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFinancialInfo(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error uploading file:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Upload Transcript File</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="text/plain" onChange={handleFileChange} />
                <button type="submit" disabled={loading} style={{ backgroundColor: loading ? 'grey' : '' }}>Upload</button>
            </form>
            {loading && <p>Loading...</p>}
            {financialInfo && (
                <div>
                    <h2>Financial Information</h2>
                    <p><strong>Client Name:</strong> {financialInfo.client_name}</p>
                    <p><strong>Advisor Name:</strong> {financialInfo.advisor_name}</p>
                    <h3>Assets</h3>
                    <ul>
                        {financialInfo.assets.map((asset: string, index: number) => (
                            <li key={index}>{asset}</li>
                        ))}
                    </ul>
                    <h3>Expenditures</h3>
                    <ul>
                        {financialInfo.expenditures.map((expenditure: string, index: number) => (
                            <li key={index}>{expenditure}</li>
                        ))}
                    </ul>
                    <h3>Income</h3>
                    <ul>
                        {financialInfo.income.map((income: string, index: number) => (
                            <li key={index}>{income}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
