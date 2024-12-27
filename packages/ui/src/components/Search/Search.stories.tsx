import type { Meta } from "@storybook/react";

import { Search } from "./index";

const meta: Meta<any> = {
  component: Search,
  title: "Forms/Search",
  parameters: {
    docs: {
      description: {
        component:
          "The Search component is an input field used to query and retrieve information from a dataset or database. It often includes features like autocomplete, suggestions, and filters to improve the search experience. This component enables users to easily find specific content or data within an application, enhancing usability and efficiency.",
      },
    },
  },
};

type Item = { Title: string };

export const Basic = () => {
  const searchFunction = async (s: string) => {
    const response = await fetch(
      `https://www.omdbapi.com?apikey=41514363&s=${s}`,
    );
    const data = await response.json();
    return data.Search;
  };

  return (
    // @ts-ignore
    <Search
      itemToString={(item: Item) => item && item.Title}
      name="movies"
      size="xs"
      placeholder="Search a movie"
      renderItem={(item: Item) => (
        <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
          {item.Title}
        </div>
      )}
      search={searchFunction}
    />
  );
};

export default meta;
