import fs from 'fs';
import Path from 'path';

/**
 * Get the list of existing files and directories into a directory
 * @param directory The directory to scan
 * @return {string[]} The list of files' paths
 */
export function listDir(directory): string[] {
  if (fs.existsSync(directory)) {
    return fs.readdirSync(directory);
  }

  console.log(`Directory not found, considered empty : ${directory}`);
  return [];
}

/**
 * Read recursively in a folder and return a flat list of the contained files
 * @param directory The folder to scan
 * @param files the current list of found files
 */
export function throughDir(directory: string, files: string[] = []): string[] {
  listDir(directory).forEach(file => {
    const absoluteFilePath = Path.join(directory, file);
    if (fs.statSync(absoluteFilePath).isDirectory()) {
      files.concat(throughDir(absoluteFilePath, files));
    } else {
      files.push(absoluteFilePath);
    }
  });

  return files;
}

/**
 * Write to a file on disk
 * @param filePath The path of the file
 * @param content The content to write
 */
export function writeSync(filePath: string, content: string) {
  const out = fs.openSync(filePath, 'w');
  fs.writeSync(out, content);
  fs.closeSync(out);
}
