import React, { HTMLAttributes, HTMLProps } from "react";

import { api } from "../utils/api";

import { Accordion, Autocomplete } from "@mantine/core";
import { ProjectChildWithChildren } from "../server/api/routers/projects";

export function ProjectTableCustom({ pid }: { pid: string }) {
  const rerender = React.useReducer(() => ({}), {})[1];

  const project = api.projects.getProjectChildrenById.useQuery(pid);

  console.log("project");
  console.log(project);

  return (
    <>
      {" "}
      <div>
        <h1>{pid}</h1>
        <RecursiveAccordion data={project.data || []} />
      </div>
    </>
  );
}

function RecursiveAccordion({ data }: { data: ProjectChildWithChildren[] }) {
  return (
    <Accordion multiple>
      {data.map((item) => (
        <Accordion.Item key={item.id} value={item.name}>
          {item.name}
          <Accordion.Panel>
            {item.projectParts && (
              <ul>
                {item.projectParts.map((projectPart) => (
                  <li key={projectPart.id}>
                    {projectPart.manufacturerPart &&
                      projectPart.manufacturerPart.partNumber}{" "}
                  </li>
                ))}
              </ul>
            )}
            {item.children && RecursiveAccordion({ data: item.children })}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
