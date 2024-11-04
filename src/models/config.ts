type ElementProps = {
  initialPage: HTMLElement | null;
  mainPage: HTMLElement | null;
};

export const config: ElementProps = {
  initialPage: document.getElementById('initialPage'),
  mainPage: document.getElementById('mainPage'),
};
