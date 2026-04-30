// my-promise.js

function wait(ms){
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            resolve("Done Waiting!");
        }, ms);
    });
}

wait(1000)
    .then(msg => console.log('Text: ', msg))
    .catch(err => console.error('Error: ', err));

async function useAwait(){
    const messageText = await wait(1000);
    console.log("Text: ", messageText);
}

useAwait();

async function useTryCatch(){
    try {
        const text = await wait(1000);
        console.log('Text: ', text);
    } catch (err){
        console.error('Error: ', err);
    };
}

useTryCatch();