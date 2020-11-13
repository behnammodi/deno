// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { exists, existsSync } from "./exists.ts";
import { getFileInfoType } from "./_util.ts";

const isWindows = Deno.build.os == "windows";

/**
 * Ensures that the link exists.
 * If the directory structure does not exist, it is created.
 *
 * @param src the source file path
 * @param dest the destination link path
 */
export async function ensureSymlink(src: string, dest: string): Promise<void> {
  if (await exists(dest)) {
    const destStatInfo = await Deno.lstat(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType !== "symlink") {
      throw new Error(
        `Ensure path exists, expected 'symlink', got '${destFilePathType}'`,
      );
    }
    return;
  }

  await ensureDir(path.dirname(dest));

  const srcStatInfo: string = await Deno.lstat(src);
  const srcFilePathType: PathType | undefined = getFileInfoType(srcStatInfo);

  const options: Deno.SymlinkOptions | undefined = isWindows
    ? {
      type: srcFilePathType === "dir" ? "dir" : "file",
    }
    : undefined;

  await Deno.symlink(src, dest, options);
}

/**
 * Ensures that the link exists.
 * If the directory structure does not exist, it is created.
 *
 * @param src the source file path
 * @param dest the destination link path
 */
export function ensureSymlinkSync(src: string, dest: string): void {
  if (existsSync(dest)) {
    const destStatInfo = Deno.lstatSync(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType !== "symlink") {
      throw new Error(
        `Ensure path exists, expected 'symlink', got '${destFilePathType}'`,
      );
    }
    return;
  }

  ensureDirSync(path.dirname(dest));

  const srcStatInfo: string = Deno.lstatSync(src);
  const srcFilePathType: PathType | undefined = getFileInfoType(srcStatInfo);

  const options: Deno.SymlinkOptions | undefined = isWindows
    ? {
      type: srcFilePathType === "dir" ? "dir" : "file",
    }
    : undefined;

  Deno.symlinkSync(src, dest, options);
}
