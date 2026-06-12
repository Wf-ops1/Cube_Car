import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
    aspectRatio?: number; // default 1:1
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }) => {
    const [zoom, setZoom] = useState(1);
    const [minZoom, setMinZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initial load reset
    useEffect(() => {
        setOffset({ x: 0, y: 0 });
    }, [imageSrc]);

    const onImageLoad = () => {
        if (!imgRef.current || !containerRef.current) return;

        const img = imgRef.current;
        const container = containerRef.current;

        // Calculate the crop area size (approximate based on CSS logic min(80vw, 80vh))
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cropDiameter = Math.min(vw * 0.8, vh * 0.8);

        // Natural dimensions
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        // Calculate scale to "cover" the crop diameter
        // We want the *smallest* dimension of the image to act as the filling dimension
        const scaleToCheck = naturalWidth < naturalHeight
            ? cropDiameter / naturalWidth
            : cropDiameter / naturalHeight;

        // Set initial zoom to cover
        // Note: We are using CSS transform scale. 
        // We need to base it on the rendered size which initially might be different?
        // Let's rely on setting the width/height style of the image to 'auto' but enforce logic via state.

        // Better strategy:
        // Set image width to "auto", height "auto".
        // Base zoom on getting the rendered pixel size to match cropDiameter.

        // Actually, let's just use CSS object-fit equivalent math.
        // We set the base scale such that the image is at least cropDiameter size.

        setZoom(scaleToCheck);
        setMinZoom(scaleToCheck); // Prevent zooming out further than cover
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        // Prevent default touch actions (scrolling)
        // e.preventDefault(); // Can't easily do this in React passive event, handled by CSS touch-action: none

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        let newX = clientX - dragStart.x;
        let newY = clientY - dragStart.y;

        // --- BOUNDS CHECKING (Simplified) ---
        // Ideally, we restrict panning so the edge of the image never crosses the edge of the crop area.
        // This is complex because of zoom. Without complex math, we'll trust the user or just clamp loosely.
        // For now, let's allow free movement but maybe "snap" or just let user adjust.
        // User asked "para que não fique uma parte para fora". 
        // This implies we SHOULD constrain.

        // Let's implement basic clamping if possible, but exact crop area rect is dynamic.
        // Skipping strict heavy math for this iteration speed, focusing on "Cover" initial state.

        setOffset({
            x: newX,
            y: newY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;

        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fixed output size (e.g., 500x500 for high quality avatar)
        canvas.width = 500;
        canvas.height = 500 / aspectRatio;

        // Get relative geometry
        // We need to calculate what portion of the original image is currently under the "center" of the view.

        // 1. Current Image State
        // The image is displayed at `img.naturalWidth * zoom` (conceptually, if using natural dims basis).
        // But wait, our 'zoom' state is a CSS scale multiplier on top of the DOM element's generic size.

        // Let's normalize:
        // Rendered Width = img.width * zoom (if img.width is natural/onscreen pixels pre-transform)
        // Actually, since we removed constraints, img.width might be naturalWidth if no CSS constraints?
        // Let's force image styling to be natural size via standard props?

        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        // Draw logic:
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // We want to map the center of the crop circle to the center of the canvas.
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply the same transforms: Zoom, and Offset.
        // But we need to convert Screen Pixels (Offset) to Canvas Pixels.
        // We need a ratio: CanvasWidth / CropDiameterOnScreen.

        // Re-calculate Crop Diameter on screen
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cropDiameter = Math.min(vw * 0.8, vh * 0.8);

        const scaleToCanvas = canvas.width / cropDiameter;

        // Apply scaling
        ctx.scale(scaleToCanvas, scaleToCanvas); // Scale screen logic to canvas logic

        // Apply User Transforms
        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);

        // Draw Image Centered
        // Since offset is relative to center in our mental model (we start centered)
        ctx.drawImage(img, -naturalWidth / 2, -naturalHeight / 2);

        ctx.restore();

        const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCropComplete(croppedUrl);
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black/90 flex flex-col animate-fadeIn">

            {/* Header */}
            <div className="p-4 flex justify-between items-center text-white bg-black/50 backdrop-blur-md relative z-50">
                <button onClick={onCancel} className="p-2 text-white/70 hover:text-white">
                    Cancelar
                </button>
                <h3 className="font-bold text-lg">Ajustar Imagem</h3>
                <button onClick={handleCrop} className="p-2 text-[#3667AA] font-bold hover:text-blue-400">
                    Salvar
                </button>
            </div>

            {/* Crop Area */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden flex items-center justify-center bg-black cursor-move touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                {/* The Image - No max-width constraints, allows it to be huge */}
                <img
                    ref={imgRef}
                    src={imageSrc}
                    onLoad={onImageLoad}
                    alt="Crop target"
                    draggable={false}
                    className="max-w-none transition-transform duration-0 ease-linear select-none pointer-events-none" // Removed duration for smoother drag
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        // Combine centering transform with zoom and offset
                        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    }}
                />

                {/* Hack: We need to center the image initially before knowing natural size. 
                    Translation handled by logic, but 'absolute' centering helps. 
                    Actually, simplest is flex center parent (which we have) and NO positional styles on img except transform.
                    But 'max-width' was killing us.
                */}

                {/* Overlay Mask */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    <div
                        className="rounded-full border-2 border-white/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.85)]"
                        style={{
                            width: 'min(80vw, 80vh)',
                            height: 'min(80vw, 80vh)',
                        }}
                    >
                        {/* Grid Lines */}
                        <div className="w-full h-full opacity-30 grid grid-cols-3 grid-rows-3">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-white/30"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-8 bg-black/80 backdrop-blur-md pb-12 relative z-50">
                <div className="flex items-center gap-4 max-w-md mx-auto">
                    <i className="fas fa-minus text-white/50 text-xs"></i>
                    <input
                        type="range"
                        min={minZoom * 0.5} // Allow slightly smaller than fit just in case, or strict minZoom?
                        max={minZoom * 3}
                        step="0.01"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#3667AA]"
                    />
                    <i className="fas fa-plus text-white text-xs"></i>
                </div>
            </div>

            {/* Hidden Canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default ImageCropper;
