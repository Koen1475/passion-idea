document.addEventListener("DOMContentLoaded", function () {
  // Load previously stored videos from local storage for the current page
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  const storedVideos = loadStoredVideos(currentPage);

  storedVideos.forEach((video) =>
    displayResult(video.title, video.description, video.embedUrl, currentPage)
  );
});

function getCurrentPage() {
  // Extract the current HTML file name, e.g., "index.html" or "tutjs.html"
  const currentPage = window.location.pathname.split("/").pop();
  return currentPage.toLowerCase();
}

function loadStoredVideos(page) {
  const storedData = localStorage.getItem(`videos_${page}`);
  return storedData ? JSON.parse(storedData) : [];
}

function deduplicateVideos(videos) {
  // Deduplicate stored videos based on embedUrl
  return Array.from(new Set(videos.map((video) => video.embedUrl))).map(
    (embedUrl) => videos.find((video) => video.embedUrl === embedUrl)
  );
}

function fetchYoutubeData() {
  const youtubeUrlInput = document.getElementById("youtubeUrl");
  const videoId = getVideoId(youtubeUrlInput.value);

  if (videoId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBtEVO8NRxbS-MbuYe-w9W_HmLB4y5ibm4`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const snippet = data.items[0].snippet;
        const videoTitle = snippet.title;
        const videoDescription = snippet.description;
        const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

        // Load previously stored videos from local storage for the current page
        const currentPage = window.location.pathname
          .split("/")
          .pop()
          .replace(".html", "");
        const storedVideos = loadStoredVideos(currentPage);

        // Check if the video is already stored
        const isVideoStored = storedVideos.some(
          (video) => video.embedUrl === videoEmbedUrl
        );

        // If not, add the new video to the list and store it in local storage
        if (!isVideoStored) {
          storedVideos.push({
            title: videoTitle,
            description: videoDescription,
            embedUrl: videoEmbedUrl,
          });

          localStorage.setItem(
            `videos_${currentPage}`,
            JSON.stringify(storedVideos)
          );

          // Display the newly added video on the page
          displayResult(
            videoTitle,
            videoDescription,
            videoEmbedUrl,
            currentPage
          );
        } else {
          alert("This video has already been posted.");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  } else {
    alert("Invalid YouTube URL");
  }
}

function isVideoAlreadyDisplayed(embedUrl) {
  // Check if the video with the same URL is already displayed on the page
  const displayedVideos = document.querySelectorAll(".video-container iframe");
  return Array.from(displayedVideos).some((video) => video.src === embedUrl);
}

// Rest of the code remains the same

function getVideoId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Updated displayResult function with resizable textarea for user notes
// Updated displayResult function with resizable textarea for user notes
function displayResult(title, description, embedUrl, page, isDeletable = true) {
  const resultsContainer = document.getElementById("results");

  // Truncate description to 100 characters
  const truncatedDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  const resultDiv = document.createElement("div");
  resultDiv.className = "result";

  const videoContainer = document.createElement("div");
  videoContainer.className = "video-container";

  const videoIframe = document.createElement("iframe");
  videoIframe.src = embedUrl;
  videoIframe.frameBorder = "0";
  videoIframe.allowFullscreen = true;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Video";
  deleteButton.className = "delete-button"; // Assign a class for styling
  deleteButton.addEventListener("click", function () {
    // Remove the video card from the page
    resultsContainer.removeChild(resultDiv);

    // Remove the video from local storage
    if (isDeletable) {
      const storedVideos = loadStoredVideos(page);
      const updatedVideos = storedVideos.filter(
        (video) => video.embedUrl !== embedUrl
      );
      localStorage.setItem(`videos_${page}`, JSON.stringify(updatedVideos));
    }
  });

  const markAsSeenButton = document.createElement("button");
  markAsSeenButton.textContent = "Marked as Seen";
  markAsSeenButton.className = "mark-as-seen-button"; // Assign a class for styling
  markAsSeenButton.addEventListener("click", function () {
    // Toggle the 'markedAsSeen' flag
    const markedAsSeen = resultDiv.classList.toggle("marked-as-seen");

    // Update local storage with the markedAsSeen flag
    const storedVideos = loadStoredVideos(page);
    const updatedVideos = storedVideos.map((video) => {
      if (video.embedUrl === embedUrl) {
        return { ...video, markedAsSeen };
      }
      return video;
    });

    localStorage.setItem(`videos_${page}`, JSON.stringify(updatedVideos));

    // Customize the border style based on the markedAsSeen flag
    resultDiv.style.border = markedAsSeen
      ? "2px solid #41f1b6" // Set border color to #41f1b6
      : "none";
  });

  // User notes textarea
  const notesTextarea = document.createElement("textarea");
  notesTextarea.placeholder = "Add your notes...";
  notesTextarea.addEventListener("input", function () {
    // Save the notes to local storage
    const storedVideos = loadStoredVideos(page);
    const updatedVideos = storedVideos.map((video) => {
      if (video.embedUrl === embedUrl) {
        return { ...video, notes: notesTextarea.value };
      }
      return video;
    });

    localStorage.setItem(`videos_${page}`, JSON.stringify(updatedVideos));
  });

  // Check if the video was marked as seen in local storage
  const storedVideos = loadStoredVideos(page);
  const storedVideo = storedVideos.find((video) => video.embedUrl === embedUrl);

  if (storedVideo) {
    // Apply the border style based on the markedAsSeen flag
    resultDiv.style.border = storedVideo.markedAsSeen
      ? "2px solid #41f1b6" // Set border color to #41f1b6
      : "none";

    // Set user notes if available
    notesTextarea.value = storedVideo.notes || "";
  }

  videoContainer.appendChild(videoIframe);

  // Original content from the original displayResult function
  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = truncatedDescription;

  resultDiv.appendChild(videoContainer);
  resultDiv.appendChild(titleElement);
  resultDiv.appendChild(descriptionElement);
  resultDiv.appendChild(notesTextarea);
  resultDiv.appendChild(deleteButton);
  resultDiv.appendChild(markAsSeenButton);

  resultsContainer.appendChild(resultDiv);
}
