import React, { useEffect } from 'react'
import ReactImageMagnify from 'react-image-magnify';
import { GlobalState } from '../utils/Context';

function Magnifire({image}) {
    const {selectedImageForProductView,setselectedImageForProductView} = GlobalState();

    return (
        <div style={{width:"100%"}}><ReactImageMagnify src={selectedImageForProductView? selectedImageForProductView :image}  {...{
            smallImage: {
                alt: 'no-image',
                isFluidWidth: false, // Changed to false to specify width and height
                    src: image,
                    width: 350, // Specify your desired width
                    height: 400, // Specify your desired height

            },
            largeImage: {
                src: image,
                width: 1200,
                height: 1800
            },

            enlargedImageContainerDimensions: {
                height: '100%',
                width: '100%',
            },
        }}
        /></div>
    )
}

export default Magnifire