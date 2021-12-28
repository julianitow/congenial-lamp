function download(filename) {
    let href = `${window.location.href}`;
    href = `${href.split('?')[0]}download?file=${filename}`;
    console.log(href);
    window.location.href = href;
}

function drop(filename) {
    window.location.href = `${window.location.href}drop?file=${filename}`;
}

function play(filename) {
    const file = filename.split('play_')[1];
    const mediaPlayer = document.getElementsByClassName('mediaPlayer')[0];
    const player = document.createElement('video');
    //player.style.width = 
    player.id = 'videoPlayer';
    player.controls = true;
    const source = document.createElement('source');
    const src = window.location.href.split('?')[0];
    source.src = `${src}play?file=${file}`;
    source.type = 'video/mp4';
    player.appendChild(source);
    mediaPlayer.appendChild(player);
}

function stopPlay() {
    const player = document.getElementById('videoPlayer');
    player.remove();
}

function init() {
    const playerModal = document.getElementById('playerModal');
    const btnsDownload = document.getElementsByClassName('download');
    const btnsPlay = document.getElementsByClassName('play');
    const btnsDelete = document.getElementsByClassName('delete');
    const closeSpan = span = document.getElementsByClassName("close")[0];

    for(let i in btnsDownload) {
        const btn = btnsDownload[i];
        if (typeof btn === 'object') {
            btn.addEventListener('click', (ev) => {
                download(ev.target.id);
            });
        }
    }

    for(let i in btnsDelete) {
        const btn = btnsDelete[i];
        if (typeof btn === 'object') {
            btn.addEventListener('click', (ev) => {
                drop(ev.target.id);
            });
        }
    }

    closeSpan.addEventListener('click', () => {
        playerModal.style.display = 'none';
        stopPlay();
    });

    for(let i in btnsPlay) {
        const btn = btnsPlay[i];
        if (typeof btn === 'object') {
            btn.addEventListener('click', (ev) => {
                playerModal.style.display = 'block';
                play(ev.target.id);
            });
        }
    }
}

function main() {
    init();
}

main();