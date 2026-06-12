import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useAddCarWizardStore } from '../../AddCarWizard.store';
import Tesseract from 'tesseract.js';
import { processImageForOCR, extractCRLVData } from '../../../utils/extractCRLVData';

const Step1_Document: React.FC = () => {
    const { nextStep, setOcrScanStatus, setExtractedData } = useAddCarWizardStore();
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setLocalScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
        setIsScanning(true);
        setLocalScanStatus('scanning');
        setOcrScanStatus('scanning');

        try {
            const processedImage = await processImageForOCR(imageUrl);

            const result = await Tesseract.recognize(processedImage, 'por', {
                logger: (m) => console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`)
            });

            const extracted = extractCRLVData(result.data.text);
            console.log("OCR CRLV Result:", extracted);

            setExtractedData(extracted);
            setLocalScanStatus('success');
            setOcrScanStatus('success');

            // Aguarda 1.5s para exibir o check de sucesso antes de enviar pro próximo step
            setTimeout(() => {
                nextStep();
            }, 1500);

        } catch (error) {
            console.error("OCR Error:", error);
            setLocalScanStatus('failed');
            setOcrScanStatus('failed');
            // Fallback: Redireciona para o formulário manual 
            setTimeout(() => {
                nextStep();
            }, 2000);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (isScanning && previewUrl) {
        return (
            <div className="flex flex-col h-full items-center justify-center -mt-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-medium text-slate-900">
                        {scanStatus === 'scanning' ? 'Analisando Documento...' :
                            scanStatus === 'success' ? 'Dados Extraídos!' : 'Falha na leitura.'}
                    </h2>
                    <p className="text-slate-500">
                        {scanStatus === 'scanning' ? 'Extraindo placa, renavam e chassi' :
                            scanStatus === 'success' ? 'Redirecionando para o formulário' : 'Indo para preenchimento manual'}
                    </p>
                </div>

                <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2rem] overflow-hidden bg-black shadow-2xl">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60" />

                    {/* Overlay UX para focar no topo do CRLV */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        {/* Top half: Clear window */}
                        <div className="absolute top-[5%] left-[5%] right-[5%] h-[45%] border-2 border-dashed border-white/70 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
                            {/* Scanning Laser Line */}
                            {scanStatus === 'scanning' && (
                                <motion.div
                                    className="w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                    style={{ position: 'absolute' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Status Icons */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none text-white">
                        <AnimatePresence>
                            {scanStatus === 'success' && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <i className="fas fa-check text-4xl"></i>
                                </motion.div>
                            )}
                            {scanStatus === 'failed' && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <i className="fas fa-exclamation text-4xl"></i>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full justify-center">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">Comece pelo Documento</h2>
                <p className="text-slate-500">Escolha como deseja importar os dados do veículo</p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto w-full">
                {/* Option 1: AI Scan */}
                <div
                    className="bg-blue-50/50 border border-blue-100 py-5 px-6 rounded-[2rem] flex items-center gap-6 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={triggerFileInput}
                >
                    <div className="w-16 h-16 bg-white text-[#3667AA] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <i className="fas fa-magic text-2xl"></i>
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-slate-900">Smart Scan (CRLV)</h3>
                        <p className="text-sm text-slate-500 leading-snug">Envie o PDF ou tire uma foto do CRLV. <br />Preenchimento automático.</p>
                    </div>
                    <i className="fas fa-chevron-right ml-auto text-slate-300 group-hover:text-[#3667AA] transition-colors"></i>
                </div>

                {/* Option 2: Manual */}
                <div
                    className="bg-slate-50 border border-slate-100 py-5 px-6 rounded-[2rem] flex items-center gap-6 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                    onClick={() => {
                        setOcrScanStatus('idle');
                        nextStep();
                    }}
                >
                    <div className="w-16 h-16 bg-white text-slate-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:text-slate-600 transition-colors">
                        <i className="fas fa-keyboard text-2xl"></i>
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-slate-900">Digitar Manualmente</h3>
                        <p className="text-sm text-slate-500 leading-snug">Preencha os dados do veículo <br />passo a passo.</p>
                    </div>
                    <i className="fas fa-chevron-right ml-auto text-slate-300 group-hover:text-slate-600 transition-colors"></i>
                </div>
            </div>
        </div>
    );
};

export default Step1_Document;
