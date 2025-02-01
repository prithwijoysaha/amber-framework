import fs from 'fs';
import path from 'path';

export const findFilesByExtension = (dir, extension, fileList = []) => {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const fileStat = fs.statSync(filePath);

		if (fileStat.isDirectory()) {
			findFilesByExtension(filePath, extension, fileList);
		} else if (file.endsWith(`.${extension}`)) {
			fileList.push(filePath);
		}
	});

	return fileList;
};
