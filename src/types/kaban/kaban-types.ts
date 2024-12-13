export type Id = string | number

export type KanbanColumnProps = {
  id: Id
  title: string
}

export type KanbanCardProps = {
  id: Id
  columnId: Id
  content: string
}
