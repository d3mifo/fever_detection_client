import { Storage } from "aws-amplify";

export const S3Upload = async (file, id, percentOut) => {
    // https://github.com/aws-amplify/amplify-js/issues/332
    const stored = await Storage.put(id, file, {
        contentType: file.type,
        progressCallback(progress) {
            let x = 100 * progress.loaded / progress.total;
            percentOut(x);
        }
    })
    return stored.key;
}

export const S3Get = async (key) => {
    const item = await Storage.get(key);
    return item;
    
}