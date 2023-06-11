const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const { getResponse } = require('./apis');

app.use(express.static(__dirname + '/assets'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

const raw = fs.readFileSync('./universities.json');
const universities = JSON.parse(raw);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.post('/step2', async (req, res) => {
	const { name, email, phone } = req.body;

	const result = await getResponse.createContact({
		name,
		email,
		phone,
	});
	const contactId = await getResponse.getContactIdByEmail(email);

	console.log(
		await getResponse.createNewsLetter({
			contacts: [contactId],
		})
	);

	res.sendFile(path.join(__dirname, '/pages/step2.html'));
});

app.get('/search', function (req, res, next) {
	const { score, group, limit, branchName } = req.query;

	fs.readFile('./pages/table.html', 'utf-8', function (err, data) {
		if (err) return next(err);

		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

		let tableDataHead = '<tr>';
		tableDataHead += `<th>Trường</th>`;
		tableDataHead += `<th>Ngành</th>`;
		tableDataHead += `<th>Điểm</th>`;
		tableDataHead += `<th>Khối</th>`;
		tableDataHead += '</tr>';

		let universitiesResult = [];
		for (let i = 0; i < universities.length; i++) {
			const university = universities[i];
			let benchmarkFind = university.benchmarks.filter((branch) => {
				let check = branch.score <= score;

				if (group) check = check && branch.groups.includes(group.toUpperCase());

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

		const loop =
			universitiesResult.length > limit && limit
				? limit
				: universitiesResult.length;
		let tableDataBody = '';
		for (let i = 0; i < loop; i++) {
			tableDataBody += '<tr>';
			let university = universitiesResult[i];
			tableDataBody += `<td rowspan="${university.benchmarks.length + 1}">${
				university['name']
			}</td>`;

			for (const branch of university.benchmarks) {
				tableDataBody += `<tr>`;
				tableDataBody += `<td>${branch['branch_name']}</td>`;
				tableDataBody += `<td>${branch['score']}</td>`;
				tableDataBody += `<td>${branch['groups']}</td>`;
				tableDataBody += `</tr>`;
			}

			tableDataBody += '</tr>';
		}
		let tableDataHTML = tableDataHead + tableDataBody;

		data = data.replace('#{tableData}', tableDataHTML);
		res.write(data);
		res.end();
	});
});

app.get('/step3', (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/step3.html'));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
