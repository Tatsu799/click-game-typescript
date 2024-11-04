export const displayNone = (ele: HTMLElement) => {
  ele.classList.remove('displayBlock');
  ele.classList.add('displayNone');
};

export const displayBlock = (ele: HTMLElement) => {
  ele.classList.remove('displayNone');
  ele.classList.add('displayBlock');
};
