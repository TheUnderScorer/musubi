import { exposedMusubiLinkSchema } from './expose';

export function createRendererLink() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const link = exposedMusubiLinkSchema.safeParse((window as any).musubiLink);

  if (!link.success) {
    console.error(link.error);

    throw new Error(
      'Musubi link is not exposed. Did you forget to call exposeElectronLink()?'
    );
  }

  return link.data;
}

export { exposeElectronLink } from './expose';
