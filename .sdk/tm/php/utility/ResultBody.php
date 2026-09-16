<?php
declare(strict_types=1);

// Obsidian SDK utility: result_body

class ObsidianResultBody
{
    public static function call(ObsidianContext $ctx): ?ObsidianResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
