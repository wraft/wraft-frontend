// Pagination.stories.tsx

import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";

import Pagination, { IProp } from "./index";

export default {
  title: "Components/Pagination",
  component: Pagination,
  argTypes: {
    onPageChange: { action: "pageChanged" },
    onPageSizeChange: { action: "pageSizeChanged" },
  },
} as Meta;

const Template: StoryFn<IProp> = (args) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Pagination
      {...args}
      onPageChange={handlePageChange}
      initialPage={currentPage}
    />
  );
};

// Default Pagination
export const Default = Template.bind({});
Default.args = {
  totalPage: 10,
  showGoto: true,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "...",
  numberPageDisplayed: 5,
  numberMarginPagesDisplayed: 2,
};

// Advanced Pagination
export const Advanced = Template.bind({});
Advanced.args = {
  type: "advanced",
  totalPage: 15,
  showGoto: true,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "...",
  numberPageDisplayed: 7,
  numberMarginPagesDisplayed: 3,
};

// Simple Pagination
export const Simple = Template.bind({});
Simple.args = {
  type: "simple",
  totalPage: 5,
  showGoto: false,
  previousLabel: "Prev",
  nextLabel: "Next",
  breakLabel: "",
  numberPageDisplayed: 3,
  numberMarginPagesDisplayed: 1,
};

// With Page Size Selector
export const WithPageSizeSelector = Template.bind({});
WithPageSizeSelector.args = {
  totalPage: 10,
  showGoto: true,
  showPageSize: true,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "...",
  numberPageDisplayed: 5,
  numberMarginPagesDisplayed: 2,
  pageSizeLabel: "Items per page",
};

// Edge Case: Single Page
export const SinglePage = Template.bind({});
SinglePage.args = {
  totalPage: 1,
  showGoto: false,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "",
  numberPageDisplayed: 3,
  numberMarginPagesDisplayed: 2,
};

// No Pagination (Edge Case)
export const NoPagination = Template.bind({});
NoPagination.args = {
  totalPage: 0,
  showGoto: false,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "",
  numberPageDisplayed: 3,
  numberMarginPagesDisplayed: 2,
};
