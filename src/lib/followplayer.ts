import type { IFloatingPlayerOptions } from './types';

type TFloatingReturn =
  | {
      dismissible: boolean;
    }
  | false;

export const getFloatingPlayer = (floatAllowed: boolean): TFloatingReturn =>
  !floatAllowed
    ? false
    : {
        dismissible: false,
      };

export class FloatingPlayer {
  private floatCheckTimer: number = 0;
  private floatTimeEditorial = 0;
  private floatTimeTotal = 0;
  private options: IFloatingPlayerOptions;
  private totalTiming = false;

  constructor(floatOptions: IFloatingPlayerOptions) {
    this.options = floatOptions;
    this.setup();
  }

  private addCloserButton(ebjwCloser: HTMLDivElement) {
    const { isSmartphone, playerParent } = this.options;

    if (!isSmartphone) {
      playerParent.querySelector('.jw-floating-container')?.appendChild(ebjwCloser);
    } else {
      playerParent.querySelector('.jw-wrapper')?.appendChild(ebjwCloser);
    }
  }

  private setup() {
    const { floatAllowed, articleTitleLength, jwPlayerInstance, playerParent } = this.options;

    // If the article title are bigger than X chars then set a smaller font-size of the title in the jwFloatingPlayer's container.
    const playerTitle = playerParent.querySelector('.jw-floating-container .jw-floating-title') as HTMLHeadingElement;

    if (playerTitle && articleTitleLength && articleTitleLength > 100) {
      playerTitle.style.fontSize = '20px';
    }
    if (playerTitle && articleTitleLength && articleTitleLength > 200) {
      playerTitle.style.fontSize = '15px';
    }

    if (floatAllowed) {
      const ebjwCloser = document.createElement('div');
      ebjwCloser.className = 'ebjw-closer';
      ebjwCloser.innerHTML = '<div class="ebjw-closer-icon">&times;</div>';
      ebjwCloser.addEventListener('click', () => {
        if (jwPlayerInstance.getFloating()) {
          jwPlayerInstance.setFloating(false);
          jwPlayerInstance.pause();
        }
      });

      if (playerParent.querySelector('.jw-wrapper')) {
        this.addCloserButton(ebjwCloser);
      } else {
        jwPlayerInstance.once('ready', () => {
          this.addCloserButton(ebjwCloser);
        });
      }

      /**
       * Survey and time handling
       */
      jwPlayerInstance.on('pause', () => {
        clearTimeout(this.floatCheckTimer);
      });

      jwPlayerInstance.on('adPlay', () => {
        this.totalTimeHandler();
      });

      jwPlayerInstance.on('play', () => {
        this.totalTimeHandler();

        /**
         * The jw player pauses and plays again when transitioning to floating player
         */
        this.floatCheckTimer = window.setInterval(() => {
          if (jwPlayerInstance.getFloating()) {
            this.floatTimeEditorial++;

            if (this.floatTimeEditorial === 5) {
              clearTimeout(this.floatCheckTimer);
            }
          }
        }, 500);
      });
    }
  }

  private totalTimeHandler() {
    const { jwPlayerInstance } = this.options;
    if (!this.totalTiming) {
      this.totalTiming = true;
      window.setInterval(() => {
        if (jwPlayerInstance.getFloating()) {
          this.floatTimeTotal++;
        }
      }, 1000);
    }
  }
}
