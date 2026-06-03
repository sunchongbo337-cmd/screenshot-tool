/** Capture the full selected display surface via browser getDisplayMedia. */
export async function captureScreenByMediaDevices(): Promise<string> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('当前环境不支持屏幕捕获（getDisplayMedia 不可用）');
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: 'always' } as MediaTrackConstraints,
    audio: false
  });

  try {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play().then(() => resolve()).catch(reject);
      };
      video.onerror = () => reject(new Error('无法读取屏幕视频流'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 0;
    canvas.height = video.videoHeight || 0;
    if (!canvas.width || !canvas.height) {
      throw new Error('获取到的画面尺寸为 0');
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建画布上下文');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}
