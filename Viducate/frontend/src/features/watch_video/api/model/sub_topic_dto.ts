import { SubTopic } from "../../domin/entity/sub_topic";

export type SubTopicDto = {
  name: string;
  start_time: number;
};

export const mapSubTopicDtoToEntity = (dto: SubTopicDto): SubTopic => {
  return new SubTopic(dto.name, dto.start_time);
};
