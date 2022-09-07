import { useQuery } from "@apollo/client";
import { FieldArray } from "formik";
import React from "react";
import {
  EnumMessagePatternConnectionOptions,
  MessagePattern,
  Topic,
} from "../../models";
import { topicsOfBroker } from "./queries/topicsQueries";
import ServiceConnectionTopicItem from "./ServiceConnectionTopicItem";

type Props = {
  messageBrokerId: string;
  enabled: boolean;
  messagePatterns: MessagePattern[];
};
type TData = {
  Topics: Topic[];
};
export default function TopicsList({
  messageBrokerId,
  enabled,
  messagePatterns,
}: Props) {
  const { data } = useQuery<TData>(topicsOfBroker, {
    variables: { messageBrokerId },
    skip: !messageBrokerId,
  });

  return data ? (
    <div>
      <FieldArray
        validateOnChange
        name="patterns"
        render={({ replace }) => {
          return data.Topics.map((topic, i) => (
            <ServiceConnectionTopicItem
              enabled={enabled}
              key={i}
              topic={topic}
              selectedPatternType={
                messagePatterns[i] || {
                  type: EnumMessagePatternConnectionOptions.None,
                  topicId: topic.id,
                }
              }
              onMessagePatternTypeChange={(pattern) => {
                replace(i, { type: pattern, topicId: topic.id });
              }}
            />
          ));
        }}
      />
    </div>
  ) : null;
}
