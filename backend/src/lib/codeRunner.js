// Local code execution engine - no external API needed
// Executes code by writing to temp files and running with the appropriate runtime

import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";
import { promisify } from "util";

const execAsync = promisify(exec);

const TIMEOUT_MS = 10000; // 10 second timeout

// Returns { run: { output, stderr } } matching Piston's response format
export async function runCode(language, code) {
  const id = randomBytes(8).toString("hex");
  const tmp = tmpdir();

  try {
    if (language === "javascript") {
      return await runJs(code, id, tmp);
    } else if (language === "python") {
      return await runPython(code, id, tmp);
    } else if (language === "java") {
      return await runJava(code, id, tmp);
    } else {
      return { run: { output: "", stderr: `Unsupported language: ${language}` } };
    }
  } catch (err) {
    return { run: { output: "", stderr: err.message } };
  }
}

async function runJs(code, id, tmp) {
  const file = join(tmp, `${id}.js`);
  await writeFile(file, code, "utf8");
  try {
    const { stdout, stderr } = await execAsync(`node "${file}"`, { timeout: TIMEOUT_MS });
    return { run: { output: stdout, stderr } };
  } catch (e) {
    return { run: { output: e.stdout || "", stderr: e.stderr || e.message } };
  } finally {
    await unlink(file).catch(() => {});
  }
}

async function runPython(code, id, tmp) {
  const file = join(tmp, `${id}.py`);
  await writeFile(file, code, "utf8");

  // Windows uses 'py' launcher; Linux/Mac use 'python3'
  const cmd = process.platform === "win32" ? "py" : "python3";
  try {
    const { stdout, stderr } = await execAsync(`${cmd} "${file}"`, { timeout: TIMEOUT_MS });
    return { run: { output: stdout, stderr } };
  } catch (e) {
    // Fallback to 'python' if 'py' not found
    try {
      const { stdout, stderr } = await execAsync(`python "${file}"`, { timeout: TIMEOUT_MS });
      return { run: { output: stdout, stderr } };
    } catch (e2) {
      return { run: { output: e2.stdout || "", stderr: e2.stderr || e2.message } };
    }
  } finally {
    await unlink(file).catch(() => {});
  }
}

async function runJava(code, id, tmp) {
  // Java class name must match file name
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : "Main";
  const srcFile = join(tmp, `${className}.java`);
  const classFile = join(tmp, `${className}.class`);

  await writeFile(srcFile, code, "utf8");
  try {
    await execAsync(`javac "${srcFile}"`, { timeout: TIMEOUT_MS, cwd: tmp });
    const { stdout, stderr } = await execAsync(`java -cp "${tmp}" ${className}`, {
      timeout: TIMEOUT_MS,
    });
    return { run: { output: stdout, stderr } };
  } catch (e) {
    return { run: { output: e.stdout || "", stderr: e.stderr || e.message } };
  } finally {
    await unlink(srcFile).catch(() => {});
    await unlink(classFile).catch(() => {});
  }
}
