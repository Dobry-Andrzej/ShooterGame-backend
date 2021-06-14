import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { storDir } from './stor-dir';
import sharp = require('sharp');
import { uuid } from 'uuidv4';

export async function removeFilesWhileErrored(
  storSubDir: string,
  ...files: any[]
) {
  for (const file of files) {
    try {
      if (file && file.filename) {
        await removeFileIfPossible(
          path.join(storDir(), storSubDir + '/'),
          file.filename,
        );
      }
    } catch (e) {}
  }
}

export async function removeFileIfPossible(dir: string, fn: string) {
  if (!fn) {
    return;
  }
  const fullPath = path.join(dir, fn);
  try {
    await util.promisify(fs.unlink)(fullPath);
  } catch (e) {
    /*Slience*/
  }
}

export async function setFileIfExists(
  entity: any,
  fieldNameForFileName: string,
  storSubDir: string,
  file: any,
  isDragAndDrop: boolean,
  width = 1000,
) {
  if (
    !file ||
    (!file.filename && !isDragAndDrop) ||
    (!file.fieldname && isDragAndDrop)
  ) {
    return false;
  }

  if (entity[fieldNameForFileName]) {
    await removeFileIfPossible(
      path.join(storDir(), storSubDir + '/'),
      entity[fieldNameForFileName],
    );
  }

  const ext = path.parse(file.originalname).ext;

  const needsCompression = ['.jpg', '.jpeg', '.png', '.bmp', '.webp'];
  try {
    if (needsCompression.includes(ext.toLowerCase())) {
      const oldFileName = file.filename;
      const newFileName = `${file.filename}.jpeg`;
      entity[fieldNameForFileName] = newFileName;

      await sharp(file.path)
        .resize(width, 1000, {
          fit: 'inside',
        })
        .toFormat('jpeg')
        .jpeg({
          quality: 90,
          force: true,
        })
        .toFile(path.resolve(`${storDir()}${storSubDir}/${newFileName}`));
      await removeFileIfPossible(
        path.join(storDir(), storSubDir + '/'),
        oldFileName,
      );
    } else {
      const newFileName = file.filename + path.parse(file.originalname).ext;

      await util.promisify(fs.rename)(
        path.join(storDir(), storSubDir + '/') + file.filename,
        path.join(storDir(), storSubDir + '/') + newFileName,
      );
      entity[fieldNameForFileName] = newFileName;
    }

    await entity.save();
    return true;
  } catch (e) {
    throw e;
  }
}

export async function overrideFileIfExists(
  entity: any,
  fieldNameForFileName: string,
  storSubDir: string,
  file: any,
  isDragAndDrop: boolean,
  width = 1000,
) {
  if (
    !file ||
    (!file.filename && !isDragAndDrop) ||
    (!file.fieldname && isDragAndDrop)
  ) {
    return false;
  }

  const ext = path.parse(file.originalname).ext;

  const needsCompression = ['.jpg', '.jpeg', '.png', '.bmp', '.webp'];
  try {
    if (needsCompression.includes(ext.toLowerCase())) {
      const oldFileName = file.filename;
      const newUuid = uuid().replace(/-/g, '');
      const newFileName = `${newUuid}.jpeg`;
      entity[fieldNameForFileName] = newFileName;

      await sharp(file.path)
        .resize(width, 1000, {
          fit: 'inside',
        })
        .toFormat('jpeg')
        .jpeg({
          quality: 90,
          force: true,
        })
        .toFile(path.resolve(`${storDir()}${storSubDir}/${newFileName}`));
      await removeFileIfPossible(
        path.join(storDir(), storSubDir + '/'),
        oldFileName,
      );
    } else {
      const newFileName = file.filename + path.parse(file.originalname).ext;

      await util.promisify(fs.rename)(
        path.join(storDir(), storSubDir + '/') + file.filename,
        path.join(storDir(), storSubDir + '/') + newFileName,
      );
      entity[fieldNameForFileName] = newFileName;
    }

    await entity.save();
    return true;
  } catch (e) {
    console.log(e, file.path, fieldNameForFileName, entity.id);
    throw e;
  }
}

export async function convertFileAndReturnNewName(
    entity: any,
    storSubDir: string,
    file: any,
    isDragAndDrop: boolean,
    width = 1024,
): Promise<any> {
  if (
      !file ||
      (!file.filename && !isDragAndDrop) ||
      (!file.fieldname && isDragAndDrop)
  )
    return false;
  const oldFileName = file.filename;
  const newFileName = `${file.filename}.jpeg`;

  await sharp(file.path)
      .resize(width, 1024, {
        fit: 'inside',
      })
      .withMetadata()
      .toFormat('jpeg')
      .jpeg({
        quality: 90,
        chromaSubsampling: '4:4:4',
        force: true,
      })
      .toFile(path.resolve(`${storDir()}${storSubDir}/${newFileName}`));
  await removeFileIfPossible(
      path.join(storDir(), storSubDir + '/'),
      oldFileName,
  );
  console.log()
  return newFileName;
}
