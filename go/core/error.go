package core

type ObsidianError struct {
	IsObsidianError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewObsidianError(code string, msg string, ctx *Context) *ObsidianError {
	return &ObsidianError{
		IsObsidianError: true,
		Sdk:              "Obsidian",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *ObsidianError) Error() string {
	return e.Msg
}
