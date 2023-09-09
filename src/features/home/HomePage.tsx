
import React from 'react';
// components
import LocationSearch from './LocationSearch';

const bgPicture = "background.jpg";
export default function HomePage(){
    const bgPicture = "background.jpg";
    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 60,
                    left: 0,
                    width: '100%',
                    height: '100vh', // Ensure the background covers the entire viewport
                    backgroundImage: `url(${bgPicture})`, // Set the background image
                    backgroundSize: 'cover', // Cover the entire element
                    backgroundRepeat: 'no-repeat', // Prevent background repetition
                    zIndex: -1, // Set a lower z-index for the background
                }}>
            </div>
            <div
                style={{
                    position: 'relative', // Ensure relative positioning for the content
                    zIndex: 1, // Set a higher z-index for the content
                }}
            >
                <h1
                    style={{
                        marginTop: '100px',
                        fontSize: '60px',
                        textAlign: 'center',
                        marginBottom: '50px', // Adjust spacing as needed
                    }}
                >
                    Choose your Perfect MMB Yeahh! </h1>
                <div
                >
                    <LocationSearch />
                </div>
            </div>
        </>
    );

};