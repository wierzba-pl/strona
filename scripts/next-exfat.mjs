import fs from "node:fs";

function normalizeReadlinkError(error) {
  if (error?.code !== "EISDIR") return error;
  const normalized = new Error(error.message.replace("EISDIR", "EINVAL"));
  normalized.code = "EINVAL";
  normalized.errno = error.errno;
  normalized.path = error.path;
  normalized.syscall = error.syscall;
  return normalized;
}

const originalReadlink = fs.readlink;
const originalReadlinkSync = fs.readlinkSync;
const originalPromisesReadlink = fs.promises.readlink.bind(fs.promises);

fs.readlink = function readlinkPatched(path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  return originalReadlink.call(fs, path, options, (error, linkString) => {
    callback?.(normalizeReadlinkError(error), linkString);
  });
};

fs.readlinkSync = function readlinkSyncPatched(path, options) {
  try {
    return originalReadlinkSync.call(fs, path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};

fs.promises.readlink = async function promisesReadlinkPatched(path, options) {
  try {
    return await originalPromisesReadlink(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};

await import("next/dist/bin/next");
