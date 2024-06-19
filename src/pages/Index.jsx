import React, { useState, useEffect } from "react";
import { Container, VStack, Text, Box, Button, Input } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import { parse } from "subtitle";

const Index = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [playing, setPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);

  useEffect(() => {
    if (subtitleFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parsedSubtitles = parse(e.target.result);
        setSubtitles(parsedSubtitles);
      };
      reader.readAsText(subtitleFile);
    }
  }, [subtitleFile]);

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
  };

  const handleSubtitleUpload = (e) => {
    const file = e.target.files[0];
    setSubtitleFile(file);
  };

  const handleProgress = ({ playedSeconds }) => {
    const current = subtitles.find((subtitle) => playedSeconds >= subtitle.start / 1000 && playedSeconds <= subtitle.end / 1000);
    setCurrentSubtitle(current ? current.text : "");
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Audio and Subtitle Player</Text>
        <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
        <Input type="file" accept=".srt" onChange={handleSubtitleUpload} />
        {audioUrl && (
          <Box width="100%">
            <ReactPlayer url={audioUrl} playing={playing} onProgress={handleProgress} controls width="100%" height="50px" />
            <Button onClick={() => setPlaying(!playing)} leftIcon={playing ? <FaPause /> : <FaPlay />}>
              {playing ? "Pause" : "Play"}
            </Button>
          </Box>
        )}
        <Box borderWidth="1px" borderRadius="lg" padding="4" width="100%" textAlign="center">
          <Text>{currentSubtitle}</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
