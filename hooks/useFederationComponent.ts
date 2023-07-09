import {
  ComponentType,
  LazyExoticComponent,
  lazy,
  useEffect,
  useState,
} from 'react';

const loadComponent = (scope: string, module: string): (() => Promise<any>) => {
  return async () => {
    await __webpack_init_sharing__('default');
    const container = window[scope];
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
};

type UseDynamicScriptReturn = {
  error: boolean;
  ready: boolean;
};

const urlCache = new Set();
const useDynamicScript = (url: string): UseDynamicScriptReturn => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }
    if (urlCache.has(url)) {
      setReady(true);
      setError(false);
      return;
    }
    setReady(false);
    setError(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setError(true);
    };

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    error,
    ready,
  };
};

type UseFederatedComponentParams = {
  remoteUrl: string;
  scope: string;
  module: string;
};

export const useFederatedComponent = <ComponentProps = void>({
  module,
  scope,
  remoteUrl,
}: UseFederatedComponentParams) => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = useState<LazyExoticComponent<
    ComponentType<ComponentProps>
  > | null>(null);

  const { ready, error } = useDynamicScript(remoteUrl);
  useEffect(() => {
    if (Component) {
      setComponent(null);
    }
  }, [key]);

  useEffect(() => {
    const canSetComponent = ready && !Component;
    if (canSetComponent) {
      const Comp = lazy(loadComponent(scope, module));
      setComponent(Comp);
    }
  }, [Component, ready, key]);

  return { error, Component };
};
