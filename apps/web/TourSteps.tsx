import { StepType } from '@reactour/tour';
import { Box } from '@wraft/ui';

const TourSteps: { [key: string]: StepType[] } = {
  LandingPage: [
    {
      selector: '[data-tour="LandingPage-none"]',
      position: 'center',
      content: () => (
        <Box>
          <Box>Introduction</Box>
          <Box>
            Welcome to the neurosynth-compose platform.
            <br />
            This is an interactive guide that will get you familiarized with the
            platform features.
          </Box>
        </Box>
      ),
    },
    {
      selector: '[data-tour="LandingPage-2"]',
      content: () => (
        <div>
          <Box>Documentation</Box>
          <Box>
            To get a more in depth understanding of neurosynth-compose, click
            this button to open the documentation.
          </Box>
        </div>
      ),
      stepInteraction: true,
    },
    {
      selector: '.tour-studies-tab',
      content: () => (
        <div>
          <Box variant="subtitle1">
            Well start with the Public Studies Page. Click on{' '}
            <b>STUDIES {'>'} PUBLIC STUDIES</b>
          </Box>
        </div>
      ),
      mutationObservables: ['.tour-highlighted-popper'],
      highlightedSelectors: ['.tour-highlighted-popper'],
      stepInteraction: true,
    },
  ],
  VarientListPage: [
    {
      selector: '[data-tour="StudiesPage-none"]',
      position: 'center',
      content: () => (
        <div>
          <Box variant="h5">Public Studies Page</Box>
          <Box>
            This page is used for querying the database for studies of interest.
          </Box>
        </div>
      ),
    },
  ],
};

export default TourSteps;
