import { randomBytes } from 'crypto';

export default function randomHexString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomHexString is useless.');
  }
  if (size % 2 !== 0) {
    throw new Error('randomHexString size must be divisible by 2.');
  }
  return randomBytes(size / 2).toString('hex');
}
