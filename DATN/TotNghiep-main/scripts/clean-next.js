const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const NEXT_DIR = path.join(process.cwd(), '.next');

function deleteFileOrDir(targetPath) {
  try {
    // Use fs.rmSync if available (Node.js 14.14.0+)
    if (fs.rmSync) {
      try {
        fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
        return true;
      } catch (error) {
        if (error.code === 'EBUSY' || error.code === 'ENOENT' || error.code === 'UNKNOWN') {
          return false;
        }
        throw error;
      }
    }
    
    // Fallback for older Node.js versions
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      fs.readdirSync(targetPath).forEach(file => {
        deleteFileOrDir(path.join(targetPath, file));
      });
      fs.rmdirSync(targetPath);
    } else {
      fs.unlinkSync(targetPath);
    }
  } catch (error) {
    // File might be locked, try again after a short delay
    if (error.code === 'EBUSY' || error.code === 'ENOENT' || error.code === 'UNKNOWN') {
      return false;
    }
    throw error;
  }
  return true;
}

function killNodeProcesses() {
  try {
    if (process.platform === 'win32') {
      // Try to kill only Next.js processes on Windows
      try {
        execSync('wmic process where "commandline like \'%next dev%\'" delete 2>nul', { stdio: 'ignore' });
      } catch (e) {
        // Fallback: kill node processes (less safe but sometimes necessary)
        try {
          execSync('taskkill /F /FI "WINDOWTITLE eq *next*" /T 2>nul', { stdio: 'ignore' });
        } catch (e2) {
          // Ignore if no processes found
        }
      }
    } else {
      // Kill node processes on Unix-like systems
      execSync('pkill -f "next dev" 2>/dev/null || true', { stdio: 'ignore' });
    }
    // Wait a bit for processes to terminate
    const start = Date.now();
    while (Date.now() - start < 500) {}
  } catch (error) {
    // Ignore errors if no processes found
  }
}

function cleanNext() {
  console.log('🔄 Đang dọn dẹp .next directory...');
  
  // Kill any running Next.js processes first
  killNodeProcesses();
  
  // Wait a bit for processes to fully terminate
  if (fs.existsSync(NEXT_DIR)) {
    // Try multiple times to delete locked files
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts && fs.existsSync(NEXT_DIR)) {
      attempts++;
      
      try {
        // Try to delete problematic files first if they exist
        const problematicFiles = [
          'react-loadable-manifest.json',
          'trace',
          'trace.json'
        ];
        
        problematicFiles.forEach(fileName => {
          const filePath = path.join(NEXT_DIR, fileName);
          if (fs.existsSync(filePath)) {
            try {
              const stat = fs.statSync(filePath);
              if (stat.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true, maxRetries: 3 });
              } else {
                fs.unlinkSync(filePath);
              }
              console.log(`✓ Đã xóa ${fileName}`);
            } catch (e) {
              // File might be locked, continue
            }
          }
        });
        
        // Delete the entire .next directory
        if (fs.existsSync(NEXT_DIR)) {
          fs.readdirSync(NEXT_DIR).forEach(file => {
            deleteFileOrDir(path.join(NEXT_DIR, file));
          });
          fs.rmdirSync(NEXT_DIR);
        }
        
        console.log('✓ Đã xóa .next directory thành công');
        return;
      } catch (error) {
        if (attempts < maxAttempts) {
          console.log(`⚠ Lần thử ${attempts}/${maxAttempts} thất bại, đang thử lại...`);
          // Wait before retrying
          const waitTime = attempts * 200;
          const start = Date.now();
          while (Date.now() - start < waitTime) {
            // Busy wait
          }
        } else {
          console.error('❌ Không thể xóa .next directory sau nhiều lần thử');
          console.error('Vui lòng đóng tất cả terminal/IDE đang chạy Next.js và thử lại');
          process.exit(1);
        }
      }
    }
  } else {
    console.log('✓ .next directory không tồn tại');
  }
}

cleanNext();

