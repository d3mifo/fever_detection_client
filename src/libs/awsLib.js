import { Storage } from "aws-amplify";

export async function S3Upload(file, id, percentOut) {
    const stored = await Storage.put(id, file, {
        contentType: file.type,
        progressCallback(progress) {
            let x = 100 * progress.loaded / progress.total;
            percentOut(x);
        }
    })
    return stored.key;
}