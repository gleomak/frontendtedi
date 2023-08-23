
import React from 'react';
// components
import LocationSearch from './LocationSearch';

export default function HomePage(){
    return (
        <div>
            <h1
                style={{
                    marginTop: '100px',
                    fontSize: '60px',
                    textAlign: 'center',
                    marginBottom: '50px', // Adjust spacing as needed
                }}
            >
            Choose your perfect Destination! </h1>
            <div
            >
                <LocationSearch />
            </div>
         </div>
    );
};