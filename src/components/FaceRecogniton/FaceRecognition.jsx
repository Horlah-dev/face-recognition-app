
import './FaceRe.css';
import Human from '@vladmandic/human';
import { useEffect, useRef, useState } from 'react';

const human = new Human({
    modelBasePath: 'https://vladmandic.github.io/human-models/models/',
    face: {
        enabled: true,
        detector: {maxDetected: 100},
        mesh: { enabled: false },
        iris: { enabled: false },
        emotion: { enabled: false },
        description: { enabled: false },
    },
        body: { enabled: false },
        hand: { enabled: false },
        object: { enabled: false },
        gesture: { enabled: false },
        segmentation: { enabled: false },
});

function FaceRecognition({ imgUrl, error, onImageError, isScanning, onDetectionComplete, token, onScanCountUpdate }) {
   
    const imageRef = useRef(null);

    const [isHumanReady, setIsHumanReady] = useState(false);
    const [loadedImageUrl, setLoadedImageUrl] = useState();
    const [detectedFaces, setDetectedFaces] = useState([]);
    
    useEffect(() => {
        async function loadHuman() {
            await human.load();
            setIsHumanReady(true);
        }
        loadHuman();
    }, [])

    useEffect(() => {
        console.log({isHumanReady, isScanning, loadedImageUrl, imgUrl, hasImage: Boolean(imageRef.current)})
        if (!isHumanReady || !isScanning || loadedImageUrl !== imgUrl || !imageRef.current) {
            return;
        }
        
        async function detectFaces() {
            try {
                console.log('Starting face detection');
            const result = await human.detect(imageRef.current);
            console.log('Face detection returned:', result.face);
            setDetectedFaces(result.face);
                if (result.face.length > 0) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scan`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Unable to update scan count');
                    }

                    onScanCountUpdate(data.scan_count);
                }   

            } catch (error) {
                console.error('Face detection failed:', error);
            
            } finally{
                onDetectionComplete();
        }
    }
            detectFaces();
            
            
    }, [isHumanReady, isScanning, loadedImageUrl, imgUrl, token, onScanCountUpdate, onDetectionComplete])

    return (
        <div className="center">

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {imgUrl && (
                <div className="image-container">

                    <img
                        ref={imageRef}
                        className="face-image"
                        crossOrigin='anonymous'
                        src={imgUrl}
                        alt="Face to be recognized"
                        onError={onImageError}
                        onLoad={() => setLoadedImageUrl(imgUrl)}
                    />

                    {isScanning && (
                        <div className="scanning-overlay">

                            <p className="scanning-line">
                                Scanning for faces...
                            </p>

                            <div className="scanning-beam"></div>

                        </div>
                    )}

                    {detectedFaces.map((face, index) => {
                const [x, y, width, height] = face.boxRaw;

                return (
                    <div
                    key={face.id ?? index}
                    className="bounding-box"
                    style={{
                        left: `${x * 100}%`,
                        top: `${y * 100}%`,
                        width: `${width * 100}%`,
                        height: `${height * 100}%`,
                    }}
                    />
                );
                })}

                </div>
            )}

        </div>
    );
}

export default FaceRecognition;
