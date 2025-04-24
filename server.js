const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const codeTypes = {
  'js': 'JavaScript',
  'jsx': 'JavaScript (React)',
  'ts': 'TypeScript',
  'tsx': 'TypeScript (React)',
  'py': 'Python',
  'java': 'Java',
  'c': 'C',
  'cpp': 'C++',
  'cs': 'C#',
  'rb': 'Ruby',
  'go': 'Go',
  'php': 'PHP',
  'html': 'HTML',
  'css': 'CSS',
  'json': 'JSON',
  'md': 'Markdown',
  'sh': 'Shell',
  'bat': 'Batch',
  'ps1': 'PowerShell',
};

function detectCodeType(filename) {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return codeTypes[ext] || ext.toUpperCase() || 'Unknown';
}

function listFiles(dir, base = dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(base, fullPath);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results.push({
        name: file,
        path: relPath,
        type: 'folder',
        children: listFiles(fullPath, base)
      });
    } else {
      results.push({
        name: file,
        path: relPath,
        type: 'file',
        codeType: detectCodeType(file)
      });
    }
  });
  return results;
}

function listFilesByLanguage(dir, base = dir) {
  let filesByLang = {};
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(base, fullPath);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      const childLangs = listFilesByLanguage(fullPath, base);
      for (const lang in childLangs) {
        if (!filesByLang[lang]) filesByLang[lang] = [];
        filesByLang[lang].push(...childLangs[lang]);
      }
    } else {
      const codeType = detectCodeType(file);
      if (!filesByLang[codeType]) filesByLang[codeType] = [];
      filesByLang[codeType].push({
        name: file,
        path: relPath,
        type: 'file',
        codeType
      });
    }
  });
  return filesByLang;
}

app.get('/api/files', (req, res) => {
  const codeDir = path.join(__dirname, 'code');
  if (!fs.existsSync(codeDir)) {
    return res.json([]);
  }
  const files = listFiles(codeDir);
  res.json(files);
});

app.get('/api/files-by-language', (req, res) => {
  const codeDir = path.join(__dirname, 'code');
  if (!fs.existsSync(codeDir)) {
    return res.json({});
  }
  const filesByLang = listFilesByLanguage(codeDir);
  res.json(filesByLang);
});

app.get('/api/file', (req, res) => {
  const relPath = req.query.path;
  if (!relPath) return res.status(400).send('No path');
  const absPath = path.join(__dirname, 'code', relPath);
  if (!fs.existsSync(absPath)) return res.status(404).send('Not found');
  const content = fs.readFileSync(absPath, 'utf8');
  res.send(content);
});

app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const codeDir = path.join(__dirname, 'code');
  if (!fs.existsSync(codeDir) || !query) {
    return res.json([]);
  }
  function searchFiles(dir, base = dir) {
    let results = [];
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const relPath = path.relative(base, fullPath);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results.push(...searchFiles(fullPath, base));
      } else if (file.toLowerCase().includes(query)) {
        results.push({
          name: file,
          path: relPath,
          codeType: detectCodeType(file)
        });
      }
    });
    return results;
  }
  const matches = searchFiles(codeDir);
  res.json(matches);
});

app.post('/api/run', (req, res) => {
  const relPath = req.body.path;
  if (!relPath) return res.status(400).send('No path');
  const absPath = path.join(__dirname, 'code', relPath);
  if (!fs.existsSync(absPath)) return res.status(404).send('Not found');
  const dir = path.dirname(absPath);
  const ext = path.extname(absPath).slice(1).toLowerCase();
  let cmd;
  if (ext === 'py') cmd = `start cmd.exe /K python \"${absPath}\"`;
  else if (ext === 'js') cmd = `start cmd.exe /K node \"${absPath}\"`;
  else if (ext === 'bat') cmd = `start cmd.exe /K \"${absPath}\"`;
  else if (ext === 'sh') cmd = `start cmd.exe /K bash \"${absPath}\"`;
  else if (ext === 'java') {
    const javaFile = path.basename(absPath);
    const className = javaFile.replace(/\.[^.]+$/, '');
    cmd = `start cmd.exe /K javac \"${absPath}\" && java -cp \"${dir}\" ${className}`;
  } else {
    cmd = `start cmd.exe /K \"${absPath}\"`;
  }
  exec(cmd, { cwd: dir });
  res.json({ success: true, message: 'Opened CMD and ran the file.' });
});

app.post('/api/runhidden', (req, res) => {
  const relPath = req.body.path;
  if (!relPath) return res.status(400).send('No path');
  const absPath = path.join(__dirname, 'code', relPath);
  if (!fs.existsSync(absPath)) return res.status(404).send('Not found');
  const dir = path.dirname(absPath);
  const ext = path.extname(absPath).slice(1).toLowerCase();
  let cmdStr;
  if (ext === 'py') {
    cmdStr = `python "${absPath}"`;
  } else if (ext === 'js') {
    cmdStr = `node "${absPath}"`;
  } else if (ext === 'bat') {
    cmdStr = `"${absPath}"`;
  } else if (ext === 'sh') {
    cmdStr = `bash "${absPath}"`;
  } else if (ext === 'java') {
    const javaFile = path.basename(absPath);
    const className = javaFile.replace(/\.[^.]+$/, '');
    cmdStr = `javac "${absPath}" && java -cp "${dir}" ${className}`;
  } else {
    cmdStr = `"${absPath}"`;
  }
  const child = require('child_process').spawn(cmdStr, { cwd: dir, shell: true });
  let stdout = '', stderr = '';
  if (child.stdout) child.stdout.on('data', d => { stdout += d.toString(); });
  if (child.stderr) child.stderr.on('data', d => { stderr += d.toString(); });
  child.on('close', code => {
    res.json({ success: code === 0, stdout, stderr, code });
  });
  child.on('error', err => {
    res.status(500).json({ success: false, error: err.message });
  });
});

app.post('/api/opencmd', (req, res) => {
  const relPath = req.body.path;
  if (!relPath) return res.status(400).send('No path');
  const absPath = path.join(__dirname, 'code', relPath);
  if (!fs.existsSync(absPath)) return res.status(404).send('Not found');
  const dir = path.dirname(absPath);
  exec(`start cmd.exe`, { cwd: dir });
  res.json({ success: true });
});

app.post('/api/openexplorer', (req, res) => {
  const relPath = req.body.path;
  if (!relPath) return res.status(400).send('No path');
  const absPath = path.join(__dirname, 'code', relPath);
  if (!fs.existsSync(absPath)) return res.status(404).send('Not found');
  const dir = fs.statSync(absPath).isDirectory() ? absPath : path.dirname(absPath);
  exec(`start explorer "${dir}"`);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
