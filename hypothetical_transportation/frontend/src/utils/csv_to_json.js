export default function csvJson(text, headers, quoteChar = '"', delimiter = ',') {
    const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');

    const match = line => {
        const matches = [...line.matchAll(regex)].map(m => m[2]);
        matches.pop(); // cut off blank match at the end
        return matches;
    }

    const lines = text.split('\n');
    const heads = headers ?? match(lines.splice(0, 1)[0]);
    heads[heads.indexOf('name')] = 'full_name'
    heads[heads.indexOf('student_email')] = 'email'


    return lines.map(line => {
        return match(line).reduce((acc, cur, i) => {
            // Attempt to parse as a number; replace blank matches with `null`
            const val = cur.length <= 0 ? null : cur.length <= 35 ? Number(cur) || cur : cur;
            const key = heads[i] ?? `extra_${i}`;
            return { ...acc, [key]: val };
        }, {});
    });

  }