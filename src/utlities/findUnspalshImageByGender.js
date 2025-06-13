function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function findUnspalshImageByGender(isMale, images) {
    let randomImage, imageDiscription, imageGender;
    do {
        randomImage = images[randomIntFromInterval(0, images.length - 1)];
        imageDiscription = !!randomImage?.description &&
            (typeof randomImage.description === 'string' || randomImage.description instanceof String)
            ? randomImage.description : " "
                + !!randomImage?.alt_description &&
                (typeof randomImage.alt_description === 'string' || randomImage.alt_description instanceof String)
                ? randomImage.alt_description : " ";
        //     console.log(imageDiscription);

        imageGender = !imageDiscription.includes("woman")
            && !imageDiscription.includes("girl");
    }

    while (isMale !== imageGender);

    return randomImage.urls.thumb
}

export default findUnspalshImageByGender