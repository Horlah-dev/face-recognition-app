
import { useCallback, useMemo, useEffect, useState } from 'react';

import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

import Navigation from './components/Navigation/Nav.jsx';
import Logo from './components/Logo/Logo.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImgLinkForm.jsx';
import Rank from './components/Rank/Rank.jsx';
import FaceRecognition from './components/FaceRecogniton/FaceRecognition.jsx';
import Authentication from './components/Authenticaton/Authentication.jsx';
import './App.css';

// Initialize the particle engine
const particlesInit = async (engine) => {
    await loadSlim(engine);
};

function App() {
    const [input, setInput] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleImageError = () => {
        setImgUrl('');
        setError('Unable to load image. Please check the URL and try again.');
        setIsScanning(false);
    };

    const handleSubmit = () => {
        const url = input.trim();

        if (!url) {
            setError('Please enter an image URL');
            setImgUrl('');
            return;
        }

        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.protocol !== 'http:' &&
                parsedUrl.protocol !== 'https:') {
                    throw new Error('Invalid URL');
                }

            setError('');
            setImgUrl(url);
            setIsScanning(true);

        } catch (error) {
            setError('Please enter a valid image URL');
            setImgUrl('');
            setIsScanning(false);
            return;
        }
    };

    const handleSignOut = () => {
        setIsAuthenticated(false);
        setInput('');
        setImgUrl('');
        setError('');
        setIsScanning(false);
        setToken(null);
        setUser(null);
    };

    const handleScanCountUpdate = useCallback((scanCount) => {
        setUser((currentUser) => {
            if (!currentUser) return currentUser;

            return {
                  ...currentUser, scan_count: scanCount 
            };
            })
    }, []);

    useEffect(() => {
        if (!token) return;

        const loadProfile = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUser(data.user);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Profile request failed:', error);
            }
        };

        loadProfile();
    }, [token]);

    const particlesLoaded = useCallback((container) => {
        console.log('Particles loaded:', container);
    }, []);

    // Particle animation settings
    const options = useMemo(() => ({
        fullScreen: {
            enable: true,
            zIndex: 0,
        },

        fpsLimit: 60,

        particles: {
            number: {
                value: 300,
                density: {
                    enable: true,
                },
            },

            color: {
                value: '#ffffff',
            },

            shape: {
                type: 'circle',
            },

            opacity: {
                value: 0.5,
            },

            size: {
                value: {
                    min: 1,
                    max: 3,
                },
            },

            links: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.35,
                width: 1,
            },

            move: {
                enable: true,
                speed: 2.5,
                direction: 'none',
                random: false,
                straight: false,
                outModes: {
                    default: 'out',
                },
            },
        },

        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab',
                },

                onClick: {
                    enable: true,
                    mode: 'push',
                },
            },

            modes: {
                grab: {
                    distance: 180,
                    links: {
                        opacity: 0.7,
                    },
                },

                push: {
                    quantity: 4,
                },
            },
        },

        detectRetina: true,
    }), []);

    return (
    <ParticlesProvider init={particlesInit}>
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
        />

        <div className="App">
            {isAuthenticated ? (
                <>
            <Navigation onSignOut={handleSignOut} />
            <Logo />
            <Rank 
                name={user?.name}
                rank={user?.scan_count ?? 0}
            />
            <ImageLinkForm
                input={input}
                onInputChange={handleInputChange}
                onButtonSubmit={handleSubmit}
            />
            <FaceRecognition 
                imgUrl={imgUrl}
                error={error}
                onImageError={handleImageError}
                isScanning={isScanning}
                onDetectionComplete={() => setIsScanning(false)}
                token={token}
                onScanCountUpdate={handleScanCountUpdate}
            />
            </>
            ) : (
            <Authentication onLogin={(receivedToken, receivedUser) => {
                setToken(receivedToken);
                setUser(receivedUser);
                setIsAuthenticated(true);
            }} />
        )}
        </div>
    </ParticlesProvider>
    );
}

export default App;
