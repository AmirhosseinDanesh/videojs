"use client";
import { useState, useRef, useEffect } from "react";
import videojs from "video.js";
import "@arte/videojs-vast";
import "video.js/dist/video-js.min.css";
import hlsQualitySelector from "videojs-hls-quality-selector";


const VideoPlayer = ({ link, vastLink }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        if (!playerRef.current) {
          const videoElement = videoRef.current;
          if (!videoElement) return;
          const player = videojs(
            videoElement,
            {
              autoplay: "auto",
              preload: "auto",
              controls: true,
              responsive: true,
              fluid: true,
              language: "fa",
              playsinline: true,
              html5: {
                nativeControlsForTouch: false,
              },
              liveui: true,
              poster: "",
              textTrackSettings: true,
              controlBar: {
                skipButtons: {
                  forward: 10,
                  backward: 10,
                },
              },
              plugins: {
                qualityLevels: {},
              },
              crossOrigin: "anonymous",
            },
          );
          playerRef.current = player;

          // VAST
          const vastVjsOptions = {
            vastUrl: vastLink,
            timeout: 5000,
            verificationTimeout: 2000,
            debug: true,
          };
          player.vast(vastVjsOptions);
          player.src({
            src: link,
            type: "application/x-mpegURL",
          });

          player.on("adplay", () => {
            console.log("adsPlaying");
          });
          player.on("adpause", () => {
            player.play();
          });
          player.on("vast.play", (event, data) => {
            console.log("VAST ad is playing");
            player.controls(false);
          });

          player.on("adended", () => {
            console.log("VAST ad adended");
            player.controls(true);
            player.play();
          });
          player.on("vast.skip", () => {
            console.log("VAST ad skip");
            player.controls(true);
          });


          player.on("ready", () => {
            console.log("ready");
          });

          player.on("play", () => {});

          player.on("pause", () => {
            console.log("pause...");
          });

          player.on("dispose", () => {});

          player.hlsQualitySelector({
            displayCurrentQuality: true,
          });
        }
      } catch (error) {
        console.error("Error initializing player:", error);
      }
    };

    initializePlayer();
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [link]);
  return (
    <div className={`h-full overflow-hidden`}>
      <div data-vjs-player className="!h-full">
        <video
          ref={videoRef}
          className={`video-js vjs-default-skin font-medium`}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
