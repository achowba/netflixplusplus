document.addEventListener('readystatechange', (event) => {

    const increasePlaybackRateElement = `
        <div class="touchable IncreasePlaybackRate PlayerControls--control-element nfp-popup-control" data-uia="increase-playback-rate-button">
            <button class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfDecreasePlaybackRate" role="button" aria-label="Increase playback rate.">
                <img src="https://res.cloudinary.com/achowba/image/upload/v1594730815/Netflix%2B%2B/plus.png" width="28px" id="increasePlaybackRate"/>
            </button>
            <div class="touchable popup-content-wrapper keep-right">
            </div>
        </div>
    `;
    const decreasePlaybackRateElement = `
        <div class="touchable DecreasePlaybackRate PlayerControls--control-element nfp-popup-control" data-uia="decrease-playback-rate-button">
            <button class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfIncreasePlaybackRate" role="button" aria-label="Decrease playback rate.">
                <img src="https://res.cloudinary.com/achowba/image/upload/v1594730815/Netflix%2B%2B/minus.png" width="28px" id="decreasePlaybackRate"/>
            </button>
            <div class="touchable popup-content-wrapper keep-right">
            </div>
        </div>
    `;
    const showPlayBackRateContainer = `
        <div class="touchable showPlaybackRate PlayerControls--control-element nfp-popup-control" data-uia="show-playback-rate-button">
            <button class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfshowPlaybackRate" role="button" aria-label="Show playback rate.">
                <p id="showPlaybackRate">1.0</p>
            </button>
            <div class="touchable popup-content-wrapper keep-right">
            </div>
        </div>
    `;

    if (event.target.readyState === "complete") {
        init();


        let videoStatus = "pause";

        function init() {
            const domTree = document.querySelector('#appMountPoint');
            const config = {
                attributes: true,
                childList: true,
                subtree: true
            };

            const callback = function(mutationsList, observer) {
                for (var mutation of mutationsList) {
                    if (mutation.type == 'childList' && mutation.target.className.toLowerCase().includes('PlayerControlsNeo__button-control-row'.toLowerCase())) {
                        const child = [...mutation.target.children].filter((child) => child.className.toLowerCase().includes('ReportAProblemPopupContainer'.toLowerCase()))[0];

                        child.insertAdjacentHTML('beforebegin', decreasePlaybackRateElement);
                        child.insertAdjacentHTML('beforebegin', showPlayBackRateContainer);
                        child.insertAdjacentHTML('beforebegin', increasePlaybackRateElement);

                        document.querySelector('#increasePlaybackRate').addEventListener('click', increasePlayBackRate);
                        document.querySelector('#decreasePlaybackRate').addEventListener('click', decreasePlayBackRate);

                        // increasePlayBackButton.addEventListener('click', increasePlayBackRate);
                        // decreasePlayBackButton.addEventListener('click', decreasePlayBackRate);

                        observer.disconnect()
                    }
                }
            };

            const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            const observer = new MutationObserver(callback);

            observer.observe(domTree, config);
        }

        function getVideoStatus() {
            const controlButton = document.querySelector('[aria-label="Play"]') ?
                document.querySelector('[aria-label="Play"]') :
                document.querySelector('[aria-label="Pause"]');

            if (controlButton) {
                return controlButton.getAttribute('aria-label').toLowerCase();
            }

            return;
        }

        function playOrPauseVideo(status, isFocused) {
            const controlButton = document.querySelector('[aria-label="Play"]') ?
                document.querySelector('[aria-label="Play"]') :
                document.querySelector('[aria-label="Pause"]');

            const isPaused = isFocused && status == "play";
            const isPlaying = !isFocused && status == "pause";

            if (isPaused) { // play it
                controlButton.click();
            } else if (isPlaying) { // pause it
                controlButton.click();
            }
        }

        function increasePlayBackRate() {
            const video = document.querySelectorAll('video')[0];

            if (getPlayBackRate() < 5) {
                video.playbackRate = video.playbackRate + 0.1;
                document.querySelector('#showPlaybackRate').innerHTML = getPlayBackRate();
            }
        }

        function decreasePlayBackRate() {
            const video = document.querySelectorAll('video')[0];

            if (getPlayBackRate() > 0.1) {
                video.playbackRate = video.playbackRate - 0.1;
                document.querySelector('#showPlaybackRate').innerHTML = getPlayBackRate();
            }
        }

        function getPlayBackRate() {
            const video = document.querySelectorAll('video')[0];
            return round(video.playbackRate, 1);
        }

        function round(value, precision) {
            const multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }

        if (window.location.hostname === "www.netflix.com") {

            window.addEventListener('blur', function() {
                videoStatus = getVideoStatus();
                playOrPauseVideo(videoStatus, document.hasFocus());
            });

            window.addEventListener('focus', function() {
                videoStatus = getVideoStatus();
                playOrPauseVideo(videoStatus, document.hasFocus());
            });

        }
    }
});
