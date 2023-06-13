require('dotenv').config();
const fs = require('fs');
const date = require('date-and-time');
const BASE_URL = process.env.BASE_URL || '';
const path = require('path');

function getTemplate(data) {
	let template = fs.readFileSync(
		path.resolve(__dirname, './template.html'),
		'utf8'
	);
	const { score, group, branchName } = data;
	const limit = 4;

	let head = `<h1>${score} điểm ${
		group ? 'khối ' + group : ''
	} nên chọn trường nào, ngành nào?</h1>`;
	head += `<p>(Cập nhật mới nhất ngày ${date.format(
		new Date(),
		'DD-MM-YYYY'
	)})</p>`;

	let table = getTableHtml(score, group, branchName, limit);

	let params = new URLSearchParams({
		score,
		group,
		branchName,
	});

	if (table) {
		let href = `${BASE_URL.replace(/\/$/, '')}/search?${params}`;
		let urlFull = `<a href="${href}">Xem đầy đủ thông tin các trường tại đây</a>`;
		table += urlFull;
	} else {
		table = '<p>Không tìm thấy trường nào theo tiêu chí tìm kiếm</p>';
	}

	let dataHtml = head + table;

	template = template.replace('#{data}', dataHtml);

	return template;
}

function getTableHtml(score, group, branchName, limit = 5) {
	const raw = fs.readFileSync('./universities.json');
	const universities = JSON.parse(raw);

	let tableData = '<table border="1" style="border-collapse: collapse"><tr>';
	tableData += `<th>Trường</th>`;
	tableData += `<th>Ngành</th>`;
	tableData += `<th style="padding: 0 20px">Điểm</th>`;
	tableData += `<th style="padding: 0 20px">Khối</th>`;
	tableData += '</tr>';

	let universitiesResult = [];
	for (let i = 0; i < universities.length; i++) {
		const university = universities[i];
		let benchmarkFind = university.benchmarks.filter((branch) => {
			let check = branch.score <= score;

			if (group)
				check =
					check &&
					branch.groups.map((group) => group[0]).includes(group.toUpperCase());

			if (branchName)
				check =
					check &&
					branch.branch_name.toLowerCase().includes(branchName.toLowerCase());

			return check;
		});
		if (benchmarkFind.length > 0) {
			let universityHasBenchmarks = {
				...university,
				benchmarks: benchmarkFind,
			};
			universitiesResult.push(universityHasBenchmarks);
		}
	}

	if (universitiesResult.length == 0) return '';

	const loop =
		universitiesResult.length > limit && limit
			? limit
			: universitiesResult.length;

	for (let i = 0; i < loop; i++) {
		tableData += '<tr>';
		let university = universitiesResult[i];
		tableData += `<td style="padding: 4px" rowspan="${
			university.benchmarks.length + 1
		}">${university['name']}</td>`;

		for (const branch of university.benchmarks) {
			tableData += `<tr>`;
			tableData += `<td style="padding: 4px">${branch['branch_name']}</td>`;
			tableData += `<td style="text-align:center">${branch['score']}</td>`;
			tableData += `<td style="text-align:center">${branch['groups'].join(
				'<br/>'
			)}</td>`;
			tableData += `</tr>`;
		}

		tableData += '</tr>';
	}
	tableData += '</table>';

	return tableData;
}

module.exports = {
	getTemplate,
	getTableHtml,
};
